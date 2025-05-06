const express = require('express');
const { verifyToken } = require('../Authntication/UserAuthn');
const { allProductsAdmin, SearchProduct, getProductByTerm, getProductById, getProductsByIds, placeOrder } = require('../Controllers/ProductController');

const router = express.Router();

router.get('/allProducts', verifyToken, allProductsAdmin);
router.get('/search', SearchProduct);
router.get('/getByName', getProductByTerm);
router.get('/getById', getProductById);
router.post('/getByIds', getProductsByIds);
router.post('/placeOrder', placeOrder);

module.exports = router;