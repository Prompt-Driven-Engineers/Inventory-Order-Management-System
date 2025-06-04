
const pool = require('../db/db_connection');

const allSellerInventoryProducts = async(req, res) => {
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

const allProducts = async (req, res) => {
    const { _id } = req.user;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (
            adminRows.length === 0 ||
            (adminRows[0].Role !== 'SuperAdmin' &&
                adminRows[0].Role !== 'Inventory Administrator')
        ) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const [products] = await pool.query(
            'SELECT * FROM inventory LIMIT ? OFFSET ?',
            [limit, offset]
        );

        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch products' });
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
    console.log(name);
    if (!name) {
        return res.status(400).json({ message: 'Search term is missing' });
    }

    const connection = await pool.getConnection(); // Or use pool.query if you're using pooling

    try {
        const searchTerms = name.trim().split(/\s+/); // split by spaces
        const likePatterns = searchTerms.map(term => `%${term}%`);

        let whereClauses = [];
        let values = [];

        // Build OR conditions for each term across important fields
        searchTerms.forEach(term => {
            const likeTerm = `%${term}%`;
            whereClauses.push(`
                (Name LIKE ? OR 
                Description LIKE ? OR 
                Brand LIKE ? OR 
                Category LIKE ? OR 
                Subcategory LIKE ?)
            `);
            values.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
        });

        const query = `
            SELECT *, 0 AS relevance
            FROM inventory
            WHERE ${whereClauses.join(" AND ")} 
            LIMIT 50;
        `;

        const [rows] = await connection.execute(query, values);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        const productIds = rows.map(product => product.ProductID); // adjust field name if needed

        // Fetch seller inventory for these products
        const [sellerRows] = await connection.execute(
            `SELECT * FROM sellerinventory WHERE ProductID IN (${productIds.map(() => '?').join(',')})`,
            productIds
        );

        // Map seller data by product ID for quick lookup
        const sellerMap = new Map();
        sellerRows.forEach(item => {
            sellerMap.set(item.ProductID, item);
        });

        // Final product list
        const finalProducts = [];

        // First: products that are available in sellerinventory
        rows.forEach(product => {
            if (sellerMap.has(product.ProductID)) {
                const sellerData = sellerMap.get(product.ProductID);
                finalProducts.push({
                    ...product,
                    ...sellerData,
                    comingSoon: false
                });
            }
        });

        // Then: products that are not in sellerinventory (mark as coming soon)
        rows.forEach(product => {
            if (!sellerMap.has(product.ProductID)) {
                finalProducts.push({
                    ...product,
                    comingSoon: true
                });
            }
        });

        res.json(finalProducts);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        connection.release(); // Always release connection if using pool
    }
};

const getProductById = async (req, res) => {
    const { id, type } = req.query;

    if (!id || !type) {
        return res.status(400).json({ message: "Missing id or type" });
    }

    const connection = await pool.getConnection();

    try {
        let sellerData = null;
        let productId = id;

        if (type === "seller") {
            const [sellerRows] = await connection.execute(
                `SELECT SellerInventoryID, ProductID, SellerID, Price, Discount, CurrentStock 
                 FROM sellerInventory 
                 WHERE SellerInventoryID = ?`,
                [id]
            );

            if (!sellerRows.length) {
                return res.status(404).json({ message: "Seller product not found" });
            }

            sellerData = sellerRows[0];
            productId = sellerData.ProductID;
        }

        const [productRows] = await connection.execute(
            'SELECT * FROM inventory WHERE ProductID = ?',
            [productId]
        );

        if (!productRows.length) {
            return res.status(404).json({ message: "Product not found in inventory" });
        }

        const productData = productRows[0];

        const finalResponse = {
            ...productData,
            ...(sellerData ? {
                SellerID: sellerData.SellerID,
                Price: sellerData.Price,
                Discount: sellerData.Discount,
                CurrentStock: sellerData.CurrentStock,
                SellerInventoryID: id
            } : {
                comingSoon: true
            })
        };

        res.status(200).json(finalResponse);
    } catch (error) {
        console.error('Fetching error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        connection.release();
    }
};

const getProductsByIds = async (req, res) => {
    const { ids } = req.body;
    console.log(ids);
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid or empty ID list" });
    }

    try {
        const placeholders = ids.map(() => '?').join(',');
        const [rows] = await pool.execute(
            `SELECT 
                si.SellerInventoryID,
                si.Price,
                si.Discount,
                si.CurrentStock,
                i.*
             FROM sellerinventory si
             JOIN inventory i ON si.ProductID = i.ProductID
             WHERE si.SellerInventoryID IN (${placeholders})`,
            ids
        );

        res.status(200).json({ products: rows });
    } catch (error) {
        console.error("Error fetching seller inventory by IDs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const placeOrder = async (req, res) => {
  const { CustomerID, ShippingAddressID, items, TotalAmount } = req.body;

  if (!CustomerID || !ShippingAddressID || !items || items.length === 0 || !TotalAmount) {
    return res.status(400).json({ message: "Missing required order details" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into orders table
    const [orderResult] = await connection.query(
      `INSERT INTO orders (CustomerID, ShippingAddressID, TotalAmount, PaymentMethod)
       VALUES (?, ?, ?, 'COD')`,
      [CustomerID, ShippingAddressID, TotalAmount]
    );

    const OrderID = orderResult.insertId;

    // 2. Insert into orderdetails + 3. Reduce stock
    for (const item of items) {
      const { Price, Quantity, SellerInventoryID } = item;

      // 2.1 Insert into orderdetails
      await connection.query(
        `INSERT INTO orderdetails (OrderID, Price, Quantity, SellerInventoryID)
         VALUES (?, ?, ?, ?)`,
        [OrderID, Price, Quantity, SellerInventoryID]
      );

      // 3. Reduce Quantity and CurrentStock in sellerinventory
      await connection.query(
        `UPDATE sellerinventory
         SET CurrentStock = CurrentStock - ?
         WHERE SellerInventoryID = ?`,
        [Quantity, SellerInventoryID]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Order placed successfully", orderId: OrderID });

  } catch (error) {
    await connection.rollback();
    console.error("❌ Order placement failed:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    connection.release();
  }
};
  
const updateProductStatus = (req, res) => {
  const productId = req.params.id;
  const { status } = req.body;
  // Validate input
  const validStatuses = ['active', 'inactive', 'suspended'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const sql = 'UPDATE inventory SET Status = ? WHERE ProductID = ?';

  pool.query(sql, [status, productId], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Status updated successfully' });
  });
};

const deleteProduct = (req, res) => {
  const productId = req.params.id;

  const sql = 'DELETE FROM inventory WHERE ProductID = ?';

  pool.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed successfully' });
  });
};

module.exports = {
    allSellerInventoryProducts,
    SearchProduct,
    getProductByTerm,
    getProductById,
    getProductsByIds,
    placeOrder,
    allProducts,
    updateProductStatus,
    deleteProduct,
};