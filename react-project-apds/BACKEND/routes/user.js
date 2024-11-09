const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");
const { User, Account, Employee,Admin,Manager } = require('./models'); // Import models from the new models file
const checkAuth = require("../check-auth");
require('dotenv').config();
const ValidationUtils = require('../utils/validationUtils'); 
const helmet = require("helmet");
const checkRole = require('../RoleMiddleware/roleMiddleware');

const router = express.Router();
router.use(helmet());
const store = new ExpressBrute.MemoryStore(); 
//const bruteforce = new ExpressBrute(store);

const bruteforce = new ExpressBrute(store, 
    {
    freeRetries: 5,               
    minWait: 5 * 60 * 1000,       
    maxWait: 15 * 60 * 1000       
    });
//------------------------------------------------------//
// Handle the POST request for registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber,role } = req.body;

    // Validate user inputs before proceeding
    if (!ValidationUtils.validateName(firstName) || !ValidationUtils.validateName(lastName)) {
        return res.status(400).send({ error: "Invalid first or last name. Use only letters." });
    }

    if (!ValidationUtils.validateEmail(email)) {
        return res.status(400).send({ error: "Invalid email format." });
    }

    if (!ValidationUtils.validateUsername(username)) {
        return res.status(400).send({ error: "Invalid username. Use only alphanumeric characters (3-20)." });
    }


    if (!ValidationUtils.validateIDNumber(idNumber)) {
        return res.status(400).send({ error: "Invalid South African ID number. Must be 13 digits." });
    }

    try {
        const accountNumber = 'AC' + Math.floor(1000000000 + Math.random() * 9000000000);

        // Generate a salt and hash the password with the salt
        const salt = await bcrypt.genSalt(10);  // 10 rounds of salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            firstName, 
            lastName, 
            email, 
            username, 
            password: hashedPassword, 
            idNumber,
            role: role || "user"
        });
        
        const savedUser = await user.save();

        const account = new Account({
            userId: savedUser._id,
            accountNumber,
            balance: 0.0
        });

        const savedAccount = await account.save();

        res.status(201).send({ user: savedUser, account: savedAccount });
        console.log('User registered and account created successfully:', savedUser, savedAccount);
    } catch (error) {
        console.error('Error saving user or creating account:', error);
        res.status(400).send({ error: "Failed to register user or create account" });
    }
});

router.post('/login', bruteforce.prevent, async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            // Check if the username exists in the Admin schema
            user = await Admin.findOne({ username });
            if (!user) {
                // Check if the username exists in the Employee schema
                user = await Employee.findOne({ username });
                if (!user) {
                    return res.status(401).send({ error: "Invalid username or password" });
                }
            }
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: "Invalid username or password" });
        }

        // Generate a JWT for the user, including the role in the payload
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username,
                role: user.role  // Include the role in the token
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Handle cases where no account exists for Admin or Employee
        let account = null;
        if (user.role === 'user') {
            // Fetch account details for 'user' only
            account = await Account.findOne({ userId: user._id });
        }

        // Respond with the token, user info, and account details (if any)
        res.status(200).send({ token, user: { id: user._id, username: user.username, role: user.role }, account });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ error: "Internal server error" });
    }
});



//------------------------------------------------------//

// Protected route to get user data
router.get('/getUser', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from verified token

        // Query the User schema to get the basic user information
        const user = await User.findById(userId).select('-password'); // Exclude password from result
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Query the Admin schema to get all admin records
        const admins = await Admin.find({}); // Get all admins
        if (!admins) {
            return res.status(404).send({ error: "No admins found" });
        }

        // Query the Employee schema to get all employee records
        const employees = await Employee.find({}); // Get all employees
        if (!employees) {
            return res.status(404).send({ error: "No employees found" });
        }

        // Prepare the response data
        // Prepare the response data
        const responseData = {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                idNumber: user.idNumber,
                role: user.role
            },

            admin: {
                id: admins._id,
                firstName: admins.firstName,
                lastName: admins.lastName,
                email: admins.email,
                username: admins.username,
                idNumber: admins.idNumber,
                role: admins.role
            },
           // admins: admins.map(admin => ({
              //  id: admin._id,
              //  userId: admin.userId,
               // role: admin.role,
            //})),
            employees: employees.map(employee => ({
                id: employee._id,
                userId: employee.userId,
                role: employee.role,
            })),
        };

        res.status(200).send(responseData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ error: "Failed to retrieve user data" });
    }
});

// Create an Employee - Only accessible to admin or manager
router.post('/createEmployee', checkAuth, checkRole(['admin', 'manager']), async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber, role } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = new Employee({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            idNumber,
            role
        });

        const savedEmployee = await employee.save();
        res.status(201).send({ user: savedEmployee });
    } catch (error) {
        console.error('Error saving user or creating account:', error);
        res.status(400).send({ error: "Failed to register user or create account" });
    }
});

//const Admin = require('./models/Admin'); // Import the Admin model

// Create Admin - Only accessible to admin
router.post('/createAdmin', checkAuth, checkRole(['admin']), async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            idNumber,
        });

        const savedAdmin = await admin.save();
        res.status(201).send({ admin: savedAdmin });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(400).send({ error: "Failed to create admin" });
    }
});

//const { Manager } = require('./models'); // Ensure this path is correct

// Define the route to create a manager
router.post('/createManager', checkAuth, checkRole(['admin']), async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber } = req.body;

    // Validate the inputs (add custom validation if needed)
    if (!firstName || !lastName || !email || !username || !password || !idNumber) {
        return res.status(400).send({ error: "All fields are required" });
    }

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the manager object
        const manager = new Manager({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            idNumber
        });

        // Save the manager to the database
        const savedManager = await manager.save();

        // Send a success response
        res.status(201).send({ manager: savedManager });
    } catch (error) {
        console.error('Error creating manager:', error);
        res.status(400).send({ error: "Failed to create manager" });
    }
});

router.get('/getUserByUsername', checkAuth, async (req, res) => {
    const { username } = req.query;  // Assuming the username is passed as a query parameter

    try {
        // Search for the username in the User schema
        let user = await User.findOne({ username });

        if (user) {
            // If a user is found, return user data
            return res.json({
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    accountNumber: user.accountNumber,
                    balance: user.balance,
                },
                schema: 'User' // Indicate which schema the data is coming from
            });
        }

        // If no user found, check the Admin schema
        let admin = await Admin.findOne({ username });
        if (admin) {
            // If an admin is found, return admin data
            return res.json({
                admin: {
                    id: admin._id,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    role: admin.role
                },
                schema: 'Admin' // Indicate which schema the data is coming from
            });
        }

        // If no admin found, check the Employee schema
        let employee = await Employee.findOne({ username });
        if (employee) {
            // If an employee is found, return employee data
            return res.json({
                employee: {
                    id: employee._id,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    role: employee.role,
                },
                schema: 'Employee' // Indicate which schema the data is coming from
            });
        }

        // If no matching username is found in any of the schemas
        return res.status(404).json({ error: 'User not found in any schema' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
//---------------------------------END OF FILE------------------------------//