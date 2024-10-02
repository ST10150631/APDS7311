const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Load SSL certificate files (replace with your actual paths)
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),     
    cert: fs.readFileSync('./keys/certificate.pem') 
};

console.log()
app.use(cors());
app.use(bodyParser.json());
app.timeout = 120000; // Sets timeout to 2 minutes (in milliseconds)
// Connect to MongoDB
mongoose.connect('mongodb+srv://st10108388:Xaei2Jqljq3AI6iv@apds-poe-part-2.f0ko9.mongodb.net/APDS-POE-DATABASE?retryWrites=true&w=majority&appName=APDS-POE-PART-2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, accountNumber, idNumber } = req.body;
    const user = new User({ firstName, lastName, email, username, password, accountNumber, idNumber });

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error saving user:', error);  // Log the error
        res.status(400).send(error);
    }
});

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});