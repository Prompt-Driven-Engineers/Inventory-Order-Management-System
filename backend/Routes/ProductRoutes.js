const express = require('express');
const { verifyToken } = require('../Authntication/UserAuthn');
const { allProductsAdmin, SearchProduct, getProductByTerm } = require('../Controllers/ProductController');

const router = express.Router();

router.get('/allProducts', verifyToken, allProductsAdmin);
router.get('/search', SearchProduct);
router.get('/getByName', getProductByTerm);

module.exports = router;