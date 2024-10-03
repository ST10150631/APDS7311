const express = require("express");
const mongoose = require("mongoose");
const db = require("../db/conn"); 
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressBrute = require("express-brute");

const PaymentSchema = new mongoose.Schema({
    recipientName : String,
    recipientsBank: String,
    recipientsAccountNumber: String,
    amountToTransfer: { type: Number },
    swiftCode: String
});

const InternationalPayment = mongoose.model('Payment', PaymentSchema);
 
//-------------------------------------------------------------//
// Handle the POST request for registration
router.post('/internationalpayment', async (req, res) => {
    const {recipientName, recipientsBank, recipientsAccountNumber, amountToTransfer, swiftCode} = req.body;

    try {
        //const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const payment = new InternationalPayment({ recipientName, recipientsBank, recipientsAccountNumber, amountToTransfer, swiftCode});
        const savedPayment = await payment.save();
        res.status(201).send(savedPayment);
        console.log('User registered successfully:', savedPayment);
    } catch (error) {
        console.error('Error sending payment:', error);
        res.status(400).send({ error: "Failed to send payment" });
    }
});
module.exports = router;