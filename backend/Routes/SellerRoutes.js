const express = require('express');
const { SellerRegister, SellerLogin, SellerDetails, AddProduct, SellerList } = require('../Controllers/SellerController');
const { verifyToken } = require('../Authntication/UserAuthn');
const upload = require('../db/Upload');

const router = express.Router();

router.post('/sellerReg', SellerRegister);
router.post('/sellerLogin', SellerLogin);
router.get('/sellerDetails', verifyToken, SellerDetails);
router.get('/sellerList', verifyToken, SellerList);
router.post("/addProduct", verifyToken, upload.array("images", 5), AddProduct);

module.exports = router;