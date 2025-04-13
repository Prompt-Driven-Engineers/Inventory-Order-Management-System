const express = require('express');
const router = express.Router();
const { CustomerRegister, CustomerLogin, CustomerDetails } = require('../Controllers/CustomerController');
const { verifyToken } = require('../Authntication/UserAuthn');

router.post('/customerReg', CustomerRegister);
router.post('/customerLogin', CustomerLogin);
router.get('/customerDetails', verifyToken, CustomerDetails);

module.exports = router;