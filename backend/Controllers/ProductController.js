
const pool = require('../db/db_connection');

const allProductsAdmin = async(req, res) => {
    const {_id} = req.user;
    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (adminRows.length === 0 || 
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Inventory Administrator")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const [products] = await pool.query(
            'SELECT * FROM sellerInventory'
        );
        
        const productIds = products.map(product => product.ProductID);
        if(productIds.length == 0) return res.status(200).json({products: []});

        const [productDetails] = await pool.query(
            'SELECT * FROM inventory WHERE ProductID IN (?)',
            [productIds]
        );

        const productList = products.map(product => {
            const pdtdtl = productDetails.find(pdtdtl => pdtdtl.ProductID === product.ProductID);
            return {...product, ...pdtdtl};
        });

        res.status(200).json({products: productList});
        
    } catch(error) {
        console.error(error);
        return res.status(500).json({error: "Failed to fetch products"});
    }
};

module.exports = {
    allProductsAdmin,
};