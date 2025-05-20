const express = require('express');
const { verifyToken } = require('../Authntication/UserAuthn');
const { allSellerInventoryProducts, SearchProduct, getProductByTerm, 
    getProductById, getProductsByIds, placeOrder, allProducts,
    updateProductStatus, deleteProduct } = require('../Controllers/ProductController');

const router = express.Router();

router.get('/allProducts', verifyToken, allProducts);
router.get('/search', SearchProduct);
router.get('/getByName', getProductByTerm);
router.get('/getById', getProductById);
router.post('/getByIds', getProductsByIds);
router.post('/placeOrder', placeOrder);
router.put('/:id/status', updateProductStatus);
router.delete('/del/:id', deleteProduct);

module.exports = router;