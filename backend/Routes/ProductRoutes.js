const express = require('express');
const { verifyToken } = require('../Authntication/UserAuthn');
const { allProductsAdmin, SearchProduct } = require('../Controllers/ProductController');

const router = express.Router();

router.get('/allProducts', verifyToken, allProductsAdmin);
router.get('/search', verifyToken, SearchProduct);

module.exports = router;