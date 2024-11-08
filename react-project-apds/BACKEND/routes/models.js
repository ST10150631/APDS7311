const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: String,
    recipientsBank: String,
    recipientsAccountNumber: String,
    amountToTransfer: Number,
    swiftCode: String,
    transactionType: String,
    status: String,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);


const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountNumber: { type: String},
    idNumber: { type: String, required: true },
    role: { type: String, enum: ["user", "employee", "admin"], default: "user" } 
});

const User = mongoose.model('User', UserSchema);


const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idNumber: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["employee", "manager"], // Defines allowed roles
        default: "employee" 
    }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    balance: { type: Number, default: 0.0 }, 
    accountNumber: { type: String, required: true },
});

const Account = mongoose.model('Account', AccountSchema);

const AdminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idNumber: { type: String, required: true },
    role: { type: String, default: "admin" }  // Fixed role as "admin"
});

const Admin = mongoose.model('Admin', AdminSchema);


const ManagerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    idNumber: { type: String, required: true },
    role: { type: String, default: "manager" }  // Fixed role as "admin"
});

const Manager = mongoose.model('Manager', ManagerSchema);



module.exports = { User, Account ,Transaction,Employee,Admin,Manager};
//-------------------------------END OF FILE--------------------//