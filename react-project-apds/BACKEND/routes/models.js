const mongoose = require("mongoose");

// User Schema for MongoDB
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

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    balance: { type: Number, default: 0.0 }, 
    accountNumber: { type: String, required: true },
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = { User, Account };
//-------------------------------END OF FILE--------------------//