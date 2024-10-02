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

// Set up express-brute
const store = new ExpressBrute.MemoryStore(); 
const bruteforce = new ExpressBrute(store);

//-------------------------------------------------------------//
// Handle the POST request for registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, accountNumber, idNumber } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const user = new User({ firstName, lastName, email, username, password: hashedPassword, accountNumber, idNumber });
        const savedUser = await user.save();
        res.status(201).send(savedUser);
        console.log('User registered successfully:', savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(400).send({ error: "Failed to register user" });
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
        // Send the token and user information
        res.status(200).send({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ error: "Internal server error" });
    }
});
//-------------------------------------------------------------//
module.exports = router;
//-------------------------------------END OF FILE-------------------------------//