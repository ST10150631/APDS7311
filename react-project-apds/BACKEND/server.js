const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 3001;
const user = require("./routes/user");
const payment = require("./routes/payment");
const { connectToDatabase } = require('./db/conn');
const helmet = require('helmet');

// Connects to the database
connectToDatabase().catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1); // Exit the application if the database connection fails
});

//Creates a variable called options that contains the key and certificate and then is used when the server starts
let options;
try {
    options = {
        key: fs.readFileSync('./keys/privatekey.pem'),     
        cert: fs.readFileSync('./keys/certificate.pem')
    };
    console.log("Keys added");
} catch (error) {
    console.error('Error loading SSL certificate or key:', error);
    process.exit(1);
}

//Routes
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/user',user);
app.route("/user",user);
app.use('/payment',payment)
app.route('/payment',payment)



// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

//------------------------------------------END OF FILE-----------------------------------//