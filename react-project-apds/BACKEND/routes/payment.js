const express = require("express");
const { User, Account,Transaction} = require('./models'); // Import the User and Account models
const checkAuth = require('../check-auth'); // Import your authentication middleware

const ValidationUtils = require('../utils/validationUtils'); 

const router = express.Router();
//------------------------------------------------------//
router.post('/internationalpayment', checkAuth, async (req, res) => {
    const { recipientName, recipientsBank, recipientsAccountNumber, amountToTransfer, swiftCode } = req.body;

    // Validate inputs before proceeding
    if (!ValidationUtils.validateName(recipientName)) {
        return res.status(400).send({ error: "Invalid recipient name. It must contain only letters and be between 1 and 50 characters." });
    }

    if (!ValidationUtils.validateName(recipientsBank)) {
        return res.status(400).send({ error: "Invalid recipient bank. It must contain only letters and be between 1 and 50 characters." });
    }

    if (!ValidationUtils.validateAccountNumber(recipientsAccountNumber)) {
        return res.status(400).send({ error: "Invalid recipient account number." });
    }

    if (!ValidationUtils.validateAmount(amountToTransfer)) {
        return res.status(400).send({ error: "Invalid amount. It must be a positive number." });
    }

    if (!ValidationUtils.validateSwiftCode(swiftCode)) {
        return res.status(400).send({ error: "Invalid SWIFT code. It must be 8 or 11 alphanumeric characters." });
    }    

    try {
        const sender = await User.findById(req.user.id); // Get user ID from the token
        if (!sender) {
            return res.status(404).send({ error: "User not found" });
        }

        const senderAccount = await Account.findOne({ userId: sender._id });
        if (!senderAccount) {
            return res.status(404).send({ error: "Sender's account not found" });
        }

        if (senderAccount.balance < amountToTransfer) {
            return res.status(400).send({ error: "Insufficient balance" });
        }

        // Deduct amount from sender's account
        senderAccount.balance -= amountToTransfer;
        await senderAccount.save();

        const recipientAccount = await Account.findOne({ accountNumber: recipientsAccountNumber });
        if (!recipientAccount) {
            return res.status(404).send({ error: "Recipient's account not found" });
        }

        // Add amount to recipient's account
        recipientAccount.balance += amountToTransfer;
        await recipientAccount.save();

        // Create a new transaction entry in the database
        const transaction = new Transaction({
            userId: sender._id, // Sender's user ID
            recipientName,
            recipientsBank,
            recipientsAccountNumber,
            amountToTransfer,
            swiftCode,
            date: new Date() // Current date
        });

        // Save the transaction
        await transaction.save();

        res.status(201).send({ 
            senderNewBalance: senderAccount.balance, 
            recipientNewBalance: recipientAccount.balance,
            transactionId: transaction._id // Optional: send back transaction ID
        });
        console.log('Payment and transaction saved successfully');
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(400).send({ error: "Failed to process payment" });
    }
});
//------------------------------------------------------//
// Handle the POST request to add balance to the user's account
router.post('/add-balance', checkAuth, async (req, res) => {
    const { amount } = req.body; 

    if (!ValidationUtils.validateAmount(amount)) {
        return res.status(400).send({ error: "Invalid amount. Please enter a valid number." });
    }

    try {
        
        const account = await Account.findOne({ userId: req.user.id });
        if (!account) {
            return res.status(404).send({ error: "Account not found" });
        }

        account.balance += amount;
        await account.save(); 

        res.status(200).send({ message: "Balance updated successfully", newBalance: account.balance });
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).send({ error: "Failed to update balance" });
    }
});
//------------------------------------------------------//
// Handle GET request to fetch transaction history for the logged-in user
router.get('/transactions', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Get user ID from token
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Fetch transactions for the logged-in user, sorted by date
        const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1 });
        res.status(200).json(transactions); // Send back the transactions as JSON
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send({ error: "Failed to fetch transactions" });
    }
});


// Handle GET request to fetch transaction history for the logged-in user
router.get('/transactions', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Get user ID from token
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Fetch transactions for the logged-in user, sorted by date
        const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1 });
        res.status(200).json(transactions); // Send back the transactions as JSON
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send({ error: "Failed to fetch transactions" });
    }
});

module.exports = router;
//----------------------------------END OF FILE---------------------------//