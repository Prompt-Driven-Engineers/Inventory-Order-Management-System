const express = require('express');
const { SellerRegister, 
        SellerLogin, 
        SellerDetails, 
        AddProduct, 
        SellerList, 
        PendingSellers,
        ModifySellerStatus,
        AddExisProduct,
        
      } = require('../Controllers/SellerController');
const { verifyToken } = require('../Authntication/UserAuthn');
const upload = require('../db/Upload');

const router = express.Router();

router.post('/sellerReg', SellerRegister);
router.post('/sellerLogin', SellerLogin);
router.get('/sellerDetails', verifyToken, SellerDetails);
router.get('/sellerList', verifyToken, SellerList);
router.get('/pendingSellers', verifyToken, SellerList);
router.put('/modSellerStatus', verifyToken, ModifySellerStatus);
router.post("/addProduct", verifyToken, upload.array("images", 5), AddProduct);
router.post("/addExisProduct", verifyToken,  AddExisProduct);

module.exports = router;