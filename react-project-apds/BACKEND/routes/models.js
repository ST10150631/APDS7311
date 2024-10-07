const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: String,
    recipientsBank: String,
    recipientsAccountNumber: String,
    amountToTransfer: Number,
    swiftCode: String,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

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

module.exports = { User, Account ,Transaction};
//-------------------------------END OF FILE--------------------//