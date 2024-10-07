const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");
const { User, Account } = require('./models'); // Import models from the new models file
const checkAuth = require("../check-auth");

const ValidationUtils = require('../utils/validationUtils'); 

const router = express.Router();
const store = new ExpressBrute.MemoryStore(); 
const bruteforce = new ExpressBrute(store);
//------------------------------------------------------//
// Handle the POST request for registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber } = req.body;

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

    if (!ValidationUtils.validatePassword(password)) {
        return res.status(400).send({ error: "Invalid password. Must be 8-30 characters with at least one letter and one number." });
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
            idNumber 
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

//------------------------------------------------------//
// Handle the POST request for login with brute force protection
router.post('/login', bruteforce.prevent, async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ error: "Invalid username or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: "Invalid username or password" });
        }

        // Generate a JWT for the user
        const token = jwt.sign({ id: user._id, username: user.username }, 'this_secret_should_be_longer_than_it_is', { expiresIn: '1h' });

        // Find the user's account information
        const account = await Account.findOne({ userId: user._id });

        // Respond with the token, user info, and account details
        res.status(200).send({ token, user: { id: user._id, username: user.username }, account });
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
        const user = await User.findById(userId).select('-password'); // Exclude password from result
        const account = await Account.findOne({ userId: user._id });

        if (!user || !account) {
            return res.status(404).send({ error: "User or account not found" });
        }

        res.status(200).send({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                idNumber: user.idNumber,
            },
            account: {
                accountNumber: account.accountNumber,
                balance: account.balance,
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ error: "Failed to retrieve user data" });
    }
});

module.exports = router;
//---------------------------------END OF FILE------------------------------//