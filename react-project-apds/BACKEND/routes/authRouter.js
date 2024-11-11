// authRoute.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT and check if user is admin
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user role is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'User does not have the required admin role' });
        }

        // If user is admin, proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Define the protected route
router.get('/checkAdmin', verifyAdmin, (req, res) => {
    res.status(200).json({ message: 'Authorized' });
});

// Export the router to use in the main server file
module.exports = router;