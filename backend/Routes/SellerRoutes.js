const express = require('express');
const { SellerRegister, SellerLogin, SellerDetails } = require('../Controllers/SellerController');
const { verifyToken } = require('../Authntication/UserAuthn');

const router = express.Router();

router.post('/sellerReg', SellerRegister);
router.post('/sellerLogin', SellerLogin);
router.get('/sellerDetails', verifyToken, SellerDetails);
// router.get('/venLogout', vendorLogout);
// router.get('/isVendorLoggedIn', checkIsLoggedin);
// router.get('/getVendorProducts', GetVendorProducts);
// router.get('/productDetails', GetProductDetails);
// router.post('/changeProduct', ChangeProductDtls);
// router.get('/requestedChanges', RequestedChanges);
// router.post('/changeStock', changeStock);
module.exports = router;