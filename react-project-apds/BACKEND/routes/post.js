
// post.mjs
import express from "express";
import mongoose from "mongoose"; 
import db from "../db/conn.js"
const router = express.Router();

// Define the User schema
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    accountNumber: String,
    idNumber: String,
});

// Create the User model
const User = mongoose.model('User', UserSchema);

// Handle the POST request for registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, accountNumber, idNumber } = req.body;
    const user = new User({ firstName, lastName, email, username, password, accountNumber, idNumber });
    let collection = await db.collection("users")
    let result = await collection.insertOne(user);
    res.send(result).status(204);
    console.log('post working');
});
    //try {
        // Save the new user to the database
       // await user.save();
        //res.status(201).send(user);
    //} catch (error) {
       // res.status(400).send({ error: "Failed to register user" });
    //}
//});

// Export the router
export default router;