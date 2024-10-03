const express = require("express");
const { User, Account } = require('./models'); // Import the User and Account models
const checkAuth = require('../check-auth'); // Import your authentication middleware

const router = express.Router();
//------------------------------------------------------//
// Handle the POST request for international payment
router.post('/internationalpayment', checkAuth, async (req, res) => {
    const { recipientName, recipientsBank, recipientsAccountNumber, amountToTransfer, swiftCode } = req.body;

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

        senderAccount.balance -= amountToTransfer;
        await senderAccount.save();

        const recipientAccount = await Account.findOne({ accountNumber: recipientsAccountNumber });
        if (!recipientAccount) {
            return res.status(404).send({ error: "Recipient's account not found" });
        }

        recipientAccount.balance += amountToTransfer;
        await recipientAccount.save();

        res.status(201).send({ senderNewBalance: senderAccount.balance, recipientNewBalance: recipientAccount.balance });
        console.log('Payment successful');
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(400).send({ error: "Failed to process payment" });
    }
});
//------------------------------------------------------//
// Handle the POST request to add balance to the user's account
router.post('/add-balance', checkAuth, async (req, res) => {
    const { amount } = req.body; 

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
module.exports = router;
//----------------------------------END OF FILE---------------------------//