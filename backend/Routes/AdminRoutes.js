const express = require('express');
const { AdminLogin, AdminDetails } = require('../Controllers/AdminController');
const { verifyToken } = require('../Authntication/UserAuthn');
const upload = require('../db/Upload');

const router = express.Router();

// router.post('/sellerReg', SellerRegister);
router.post('/adminLogin', AdminLogin);
router.get('/adminDetails', verifyToken, AdminDetails);
// router.get('/sellerDetails', verifyToken, SellerDetails);
// router.post("/addProduct", verifyToken, upload.array("images", 5), AddProduct);

module.exports = router;