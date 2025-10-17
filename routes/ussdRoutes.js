// routes/ussdRoutes.js
const express = require('express');
const router = express.Router();

// Sample USSD route - modify according to your needs
router.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    
    let response = '';
    
    if (text === '') {
        // First menu
        response = `CON Welcome to SafeMove
        1. Book Ride
        2. Emergency
        3. Check Balance`;
    } else if (text === '1') {
        response = `CON Enter your destination:
        (e.g., Nairobi CBD)`;
    } else if (text === '2') {
        response = `END Emergency services alerted. Help is on the way!`;
    } else if (text === '3') {
        response = `END Your balance is KES 500`;
    }
    
    res.send(response);
});

module.exports = router;