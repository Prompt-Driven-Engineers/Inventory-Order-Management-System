const express = require('express');
const router = express.Router();
const { 
        CustomerRegister, 
        CustomerLogin, 
        CustomerDetails, 
        handleWishlist,
        removeFromWishlist,
        isWishlisted, 
        isCarted, 
        handleCart, 
        getCart,
        getWishlist,
        handleCartQuantity,
        getOrders,
        cancelOrder,
        getAllCustomers,
        updateCustomerStatus,
    } = require('../Controllers/CustomerController');
const { verifyToken } = require('../Authntication/UserAuthn');

router.post('/customerReg', CustomerRegister);
router.post('/customerLogin', CustomerLogin);
router.get('/customerDetails', verifyToken, CustomerDetails);
router.post('/isWishlist', verifyToken, isWishlisted);
router.post('/handleWishlist', verifyToken, handleWishlist);
router.delete('/removeFromWishlist', verifyToken, removeFromWishlist);
router.post('/isCarted', verifyToken, isCarted);
router.post('/handleCart', verifyToken, handleCart);
router.get('/getCart', verifyToken, getCart);
router.get('/getWishlist', verifyToken, getWishlist);
router.put('/changeCartQuantity', verifyToken, handleCartQuantity);
router.get('/getOrderedProducts', verifyToken, getOrders);
router.put('/getOrderedProducts/:orderId', verifyToken, cancelOrder);
router.get('/customerList', verifyToken, getAllCustomers);
router.put('/:id/status', updateCustomerStatus);

module.exports = router;