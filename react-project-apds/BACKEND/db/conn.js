const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log("MongoDB Connection String:", connectionString);

const connectToDatabase = async () => {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB IS CONNECTED');
        
    } catch (e) {
        console.error('Database connection error:', e);
        throw e;
    }
};

module.exports = { connectToDatabase };