const express = require('express');
const { verifyToken } = require('../Authntication/UserAuthn');
const { allProductsAdmin } = require('../Controllers/ProductController');

const router = express.Router();

router.get('/allProducts', verifyToken, allProductsAdmin);

module.exports = router;