const express = require('express');
const { AdminLogin, AdminDetails, AdminRegister, AdminList, AdminListMod, ModifyRole, ModifyStatus, fetchSellerInventory, updateInventoryStatus, fetchAllOrdersWithDetails } = require('../Controllers/AdminController');
const { verifyToken } = require('../Authntication/UserAuthn');
const upload = require('../db/Upload');

const router = express.Router();

router.post('/adminReg', verifyToken, AdminRegister);
router.post('/adminLogin', AdminLogin);
router.get('/adminDetails', verifyToken, AdminDetails);
router.get('/adminList', verifyToken, AdminList);
router.get('/adminListMod', verifyToken, AdminListMod);
router.put('/modRole', verifyToken, ModifyRole);
router.put('/modStatus', verifyToken, ModifyStatus);
router.get('/sellerInventory', verifyToken, fetchSellerInventory);
router.put('/updateStatus/:inventoryId', verifyToken, updateInventoryStatus);
router.get('/allOrders', verifyToken, fetchAllOrdersWithDetails);

module.exports = router;