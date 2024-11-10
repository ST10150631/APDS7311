const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");
const { User, Account, Employee, Admin, Manager } = require('./models');
const checkAuth = require("../check-auth");
require('dotenv').config();
const ValidationUtils = require('../utils/validationUtils');
const helmet = require("helmet");
const checkRole = require('../RoleMiddleware/roleMiddleware');

const router = express.Router();
router.use(helmet());
const store = new ExpressBrute.MemoryStore();

const bruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5 * 60 * 1000,
    maxWait: 15 * 60 * 1000
});

// Secure POST request for registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber, role } = req.body;

    // Validate user inputs
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            username: username.toLowerCase(),  // Normalize username
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
        // Sanitize and normalize username
        const sanitizedUsername = username.toLowerCase();

        let user = await User.findOne({ username: sanitizedUsername });
        if (!user) {
            user = await Admin.findOne({ username: sanitizedUsername });
            if (!user) {
                user = await Employee.findOne({ username: sanitizedUsername });
                if (!user) {
                    return res.status(401).send({ error: "Invalid username or password" });
                }
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        let account = null;
        if (user.role === 'user') {
            account = await Account.findOne({ userId: user._id });
        }

        res.status(200).send({ token, user: { id: user._id, username: user.username, role: user.role }, account });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Fetch user data securely
router.get('/getUserByUsername', checkAuth, async (req, res) => {
    const { username } = req.query;

    try {
        const sanitizedUsername = username.toLowerCase();

        let user = await User.findOne({ username: sanitizedUsername });
        if (user) {
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
                schema: 'User'
            });
        }

        let admin = await Admin.findOne({ username: sanitizedUsername });
        if (admin) {
            return res.json({
                admin: {
                    id: admin._id,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    role: admin.role
                },
                schema: 'Admin'
            });
        }

        let employee = await Employee.findOne({ username: sanitizedUsername });
        if (employee) {
            return res.json({
                employee: {
                    id: employee._id,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    role: employee.role,
                },
                schema: 'Employee'
            });
        }

        return res.status(404).json({ error: 'User not found in any schema' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
