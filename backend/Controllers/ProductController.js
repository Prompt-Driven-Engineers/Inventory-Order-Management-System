
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

const SearchProduct = async (req, res) => {
    const { keyword } = req.query;

    try {
        const query = `
            SELECT ProductID, Name, Brand, Category, Subcategory, images 
            FROM inventory
            WHERE Name LIKE ? 
               OR Category LIKE ? 
               OR Subcategory LIKE ? 
               OR Brand LIKE ?
            LIMIT 10
        `;
        const [results] = await pool.execute(query, [
            `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`
        ]);

        res.status(200).json(results);
    } catch (err) {
        console.error("Error searching products:", err);
        res.status(500).json({ error: "Failed to search products" });
    }
};

const getProductByTerm = async (req, res) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).json({ message: 'Search term is missing' });
    }

    const connection = await pool.getConnection(); // Or use pool.query if you're using pooling

    try {
        // Split terms for broader matching
        const searchTerms = name.split(' ').map(term => `%${term}%`);

        // Build dynamic WHERE clause for each term and each field
        const whereClauses = searchTerms.map(() => `
            (Name LIKE ? OR 
             Description LIKE ? OR 
             Brand LIKE ? OR 
             Category LIKE ? OR 
             Subcategory LIKE ?)
        `).join(" OR ");

        const values = searchTerms.flatMap(term => [term, term, term, term, term]);

        const query = `
            SELECT * FROM inventory
            WHERE ${whereClauses}
            LIMIT 50;
        `;

        const [rows] = await connection.execute(query, values);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        connection.release(); // Always release connection if using pool
    }
};



module.exports = {
    allProductsAdmin,
    SearchProduct,
    getProductByTerm,
};