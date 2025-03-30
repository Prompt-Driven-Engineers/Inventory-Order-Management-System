const express = require('express');
const { SellerRegister, SellerLogin, SellerDetails, AddProduct } = require('../Controllers/SellerController');
const { verifyToken } = require('../Authntication/UserAuthn');
const upload = require('../db/Upload');

const router = express.Router();

router.post('/sellerReg', SellerRegister);
router.post('/sellerLogin', SellerLogin);
router.get('/sellerDetails', verifyToken, SellerDetails);
router.post("/addProduct", verifyToken, upload.array("images", 5), AddProduct);

module.exports = router;