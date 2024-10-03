const express = require("express");
const mongoose = require("mongoose");
const db = require("../db/conn"); 
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");

//User Schema for MongoDB
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    accountNumber: String,
    idNumber: String,
});

const User = mongoose.model('User', UserSchema);

// Account Schema for MongoDB
const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
    balance: { type: Number, default: 0.0 }, 
    accountNumber: { type: String, required: true },
});

const Account = mongoose.model('Account', AccountSchema);

const store = new ExpressBrute.MemoryStore(); 
const bruteforce = new ExpressBrute(store);

//-------------------------------------------------------------//
// Handle the POST request for registration
// Creates a User and Account for the user and then connects that account to the user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, idNumber } = req.body; // Removed accountNumber from the request body
    try {
        const accountNumber = 'AC' + Math.floor(1000000000 + Math.random() * 9000000000);
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const user = new User({ firstName, lastName, email, username, password: hashedPassword, idNumber });
        const savedUser = await user.save();
        const account = new Account({
            userId: savedUser._id, // Link to the user
            accountNumber,         
            balance: 0.0           
        });
        const savedAccount = await account.save();
        // Send back both the user and account information
        res.status(201).send({ user: savedUser, account: savedAccount });
        console.log('User registered and account created successfully:', savedUser, savedAccount);
    } catch (error) {
        console.error('Error saving user or creating account:', error);
        res.status(400).send({ error: "Failed to register user or create account" });
    }
});

//-------------------------------------------------------------//
// Handle the POST request for login with brute force protection
router.post('/login', bruteforce.prevent, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ error: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: "Invalid username or password" });
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

        // Fetch the user's account information
        const account = await Account.findOne({ userId: user._id });

        // Send the token, user, and account information
        res.status(200).send({ token, user: { id: user._id, username: user.username }, account });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ error: "Internal server error" });
    }
});
//-------------------------------------------------------------//
module.exports = router;
//-------------------------------------END OF FILE-------------------------------//