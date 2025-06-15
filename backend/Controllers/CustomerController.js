const bcrypt = require('bcryptjs');
const pool = require('../db/db_connection');
const {setUser, getUser} = require('../Authntication/UserAuthn');

const CustomerRegister = async (req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    try {
        const { Name, Email, Phone, Phone2, Address, PasswordHash } = req.body;
        const phone2 = req.body.Phone2.trim() === "" ? null : req.body.Phone2;
        // Step 1: Insert into Users table
        const [userResult] = await connection.query(
            `INSERT INTO users (Name, Email, Phone, Phone2) VALUES (?, ?, ?, ?)`,
            [Name, Email, Phone, phone2]
        );
        const UserID = userResult.insertId; // Get generated UserID

        // Step 2: Insert into UserTypes table
        await connection.query(
            `INSERT INTO usertypes (UserID, UserType) VALUES (?, ?)`,
            [UserID, "Customer"]
        );

        // Step 3: Insert into Customers table
        await connection.query(
            `INSERT INTO customers (CustomerID) VALUES (?)`,
            [UserID]
        );        

        // Step 4: Insert into Addresses table
        await connection.query(
            `INSERT INTO address (UserID, Landmark, Street, City, State, Country, ZIP, AddressType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [UserID, Address.Landmark, Address.Street, Address.City, Address.State, Address.Country, Address.ZIP, Address.AddressType]
        );

        const hashedPassword = await bcrypt.hash(PasswordHash, 10);

        // Step 5: Insert into Passwords table
        await connection.query(
            `INSERT INTO userpasswords (UserID, PasswordHash) VALUES (?, ?)`,
            [UserID, hashedPassword]
        );

        await connection.commit(); // Commit transaction
        connection.release();

        res.status(201).json({ message: 'User registered successfully', UserID });

    } catch (error) {
        await connection.rollback(); // Rollback transaction on error
        connection.release();
        console.log(error.message);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

const CustomerLogin = async (req, res) => {
    const { Email, Password } = req.body;
    const connection = await pool.getConnection();

    try {
        // **Step 1: Check if Email exists and retrieve UserID**
        const [userRows] = await connection.query(
            `SELECT UserID FROM users WHERE Email = ?`, 
            [Email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const UserID = userRows[0].UserID;

        const [customerRows] = await connection.query(
            `SELECT CustomerID FROM customers WHERE CustomerID = ?`,
            [UserID]
        )

        if (customerRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // **Step 2: Retrieve hashed password from passwords table**
        const [passwordRows] = await connection.query(
            `SELECT PasswordHash FROM userpasswords WHERE UserID = ?`,
            [UserID]
        );

        if (passwordRows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const hashedPassword = passwordRows[0].PasswordHash;

        // **Step 3: Compare user-entered password with hashed password**
        const isMatch = await bcrypt.compare(Password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Wrong Password" });
        }

        // **Step 4: Generate JWT token using setUser**
        const token = setUser({ UserID, Email, Role: 'Customer' });

        // **Step 5: Set cookie and send response**
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful", UserID });

    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    } finally {
        connection.release(); // Ensure the connection is released
    }
};

const CustomerDetails = async (req, res) => {
    const { _id, Email } = req.user;

    try {
        // Fetch user details directly using pool (no manual connection)
        const userQuery = `SELECT Name, Email, Phone  FROM users WHERE UserID = ?`;
        const [userResults] = await pool.execute(userQuery, [_id]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch address
        const [addressRows] = await pool.query(`SELECT * FROM address WHERE UserID = ?`,
            [_id]
        );

        const [customerRows] = await pool.query(
            'SELECT SubscriptionStatus, Status, TotalOrders, Points FROM customers WHERE CustomerID = ?',
            [_id]
        )

        // Format address list
        const addresses = addressRows.map(addr => ({
            AddressID: addr.AddressID,
            Landmark: addr.Landmark,
            Street: addr.Street,
            City: addr.City,
            State: addr.State,
            Country: addr.Country,
            Zip: addr.Zip,
            AddressType: addr.AddressType
        }));

        // Merge results
        const customerData = {
            name: userResults[0].Name,  
            email: userResults[0].Email,
            phone: userResults[0].Phone,
            SubscriptionStatus: customerRows[0].SubscriptionStatus,
            Status: customerRows[0].Status,
            TotalOrders: customerRows[0].TotalOrders,
            Points: customerRows[0].Points,
            addresses
        };
        
        res.status(200).json(customerData);
        
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to fetch", details: error.message });
    }
};

const isWishlisted = async (req, res) => {
    const { _id, role } = req.user;
    const { productId, type } = req.body;

    try {
        if (role !== 'Customer') return res.status(403).json({ message: "Unauthorized" });

        let query, params;

        if (type === 'seller') {
            query = 'SELECT * FROM wishlist WHERE CustomerID = ? AND SellerInventoryID = ?';
            params = [_id, productId];
        } else if (type === 'product') {
            query = 'SELECT * FROM wishlist WHERE CustomerID = ? AND ProductID = ?';
            params = [_id, productId];
        } else {
            return res.status(400).json({ message: "Invalid type" });
        }

        const [wishlistRows] = await pool.query(query, params);

        if (wishlistRows.length > 0) {
            return res.status(200).json({ isWishlisted: true });
        } else {
            return res.status(200).json({ isWishlisted: false });
        }

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to check wishlist", details: error.message });
    }
};

const handleWishlist = async (req, res) => {
    const { _id, role } = req.user;
    const { productId, type, isWishlisted } = req.body;

    if (role !== 'Customer') {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        if (type === 'seller') {
            if (!isWishlisted) {
                await pool.execute(
                    'DELETE FROM wishlist WHERE CustomerID = ? AND SellerInventoryID = ?',
                    [_id, productId]
                );
                return res.status(200).json({ message: "Removed from wishlist" });
            } else {
                const [rows] = await pool.execute(
                    'SELECT ProductID FROM sellerInventory WHERE SellerInventoryID = ?',
                    [productId]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ message: "Seller inventory item not found" });
                }

                const productID = rows[0].ProductID;

                // ✅ Check before inserting
                const [existing] = await pool.execute(
                    'SELECT * FROM wishlist WHERE CustomerID = ? AND ProductID = ? AND SellerInventoryID = ?',
                    [_id, productID, productId]
                );

                if (existing.length > 0) {
                    return res.status(200).json({ message: "Already in wishlist" });
                }

                await pool.execute(
                    'INSERT INTO wishlist (CustomerID, ProductID, SellerInventoryID) VALUES (?, ?, ?)',
                    [_id, productID, productId]
                );

                return res.status(200).json({ message: "Added to wishlist" });
            }

        } else if (type === 'product') {
            if (!isWishlisted) {
                await pool.execute(
                    'DELETE FROM wishlist WHERE CustomerID = ? AND ProductID = ? AND SellerInventoryID IS NULL',
                    [_id, productId]
                );
                return res.status(200).json({ message: "Removed from wishlist" });
            } else {
                // ✅ Check before inserting
                const [existing] = await pool.execute(
                    'SELECT * FROM wishlist WHERE CustomerID = ? AND ProductID = ? AND SellerInventoryID IS NULL',
                    [_id, productId]
                );

                if (existing.length > 0) {
                    return res.status(200).json({ message: "Already in wishlist" });
                }

                await pool.execute(
                    'INSERT INTO wishlist (CustomerID, ProductID) VALUES (?, ?)',
                    [_id, productId]
                );

                return res.status(200).json({ message: "Added to wishlist" });
            }

        } else {
            return res.status(400).json({ message: "Invalid wishlist type" });
        }

    } catch (error) {
        console.error("Database Error in handleWishlist:", error);
        return res.status(500).json({ error: "Failed to handle wishlist", details: error.message });
    }
};

const removeFromWishlist = async(req, res) => {
    const { _id, role } = req.user;
    const { WishlistID } = req.body;

    if (role !== 'Customer') return res.status(403).json({ message: "Unauthorized" });

    try {
        pool.query(
            'DELETE FROM wishlist WHERE WishlistID = ?',
            [WishlistID]
        )

        res.status(200).status({message: "Product removed from wishlist"});
    } catch(error) {
        console.error("Database Error in handleWishlist:", error);
        return res.status(500).json({ error: "Failed to handle wishlist", details: error.message });
    }
}

const isCarted = async (req, res) => {
    const { _id, role } = req.user;
    const { SellerInventoryID } = req.body;

    try {
        if (role !== 'Customer') return res.status(403).json({ message: "Unauthorized" });

        const [cartRows] = await pool.query(
            'SELECT * FROM cart WHERE CustomerID = ? AND SellerInventoryID = ?',
            [_id, SellerInventoryID]
        );

        if (cartRows.length > 0) {
            return res.status(200).json({ isCarted: true });
        } else {
            return res.status(200).json({ isCarted: false });
        }

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to check cart", details: error.message });
    }
};

const handleCart = async (req, res) => {
    const { _id, role } = req.user;
    const { SellerInventoryID, isCarted } = req.body;

    if (role !== 'Customer') {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        if (!isCarted) {
            await pool.execute(
                'DELETE FROM cart WHERE CustomerID = ? AND SellerInventoryID = ?',
                [_id, SellerInventoryID]
            );
            return res.status(200).json({ message: "Removed from wishlist" });
        } else {

            // ✅ Check before inserting
            const [existing] = await pool.execute(
                'SELECT * FROM cart WHERE CustomerID = ? AND SellerInventoryID = ?',
                [_id, SellerInventoryID]
            );

            if (existing.length > 0) {
                return res.status(200).json({ message: "Already in cart" });
            }

            await pool.execute(
                'INSERT INTO cart (CustomerID, SellerInventoryID) VALUES (?, ?)',
                [_id, SellerInventoryID]
            );

            return res.status(200).json({ message: "Added to cart" });
        }

    } catch (error) {
        console.error("Database Error in cart:", error);
        return res.status(500).json({ error: "Failed to handle cart", details: error.message });
    }
};

const getCart = async (req, res) => {
    const { _id, role } = req.user;

    try {
        if (role !== 'Customer') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const [cartedProductRows] = await pool.query(
            `SELECT 
                c.SellerInventoryID,
                c.Quantity,
                si.Price,
                si.Discount,
                si.CurrentStock,
                i.*
             FROM cart c
             JOIN sellerinventory si ON c.SellerInventoryID = si.SellerInventoryID
             JOIN inventory i ON si.ProductID = i.ProductID
             WHERE c.CustomerID = ?`,
            [_id]
        );

        res.status(200).json({ cartedProducts: cartedProductRows });
    } catch (error) {
        console.error("Database Error in cart:", error);
        return res.status(500).json({ error: "Failed to fetch cart", details: error.message });
    }
};

const getWishlist = async (req, res) => {
    const { _id, role } = req.user;

    if (role !== 'Customer') {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const [wishlistedProducts] = await pool.execute(
            `SELECT 
                w.WishlistID,
                w.SellerInventoryID,
                i.*,
                si.Price,
                si.Discount,
                si.CurrentStock
             FROM wishlist w
             JOIN inventory i ON w.ProductID = i.ProductID
             LEFT JOIN sellerinventory si ON w.SellerInventoryID = si.SellerInventoryID
             WHERE w.CustomerID = ?`,
            [_id]
        );

        res.status(200).json({ wishlistedProducts });
    } catch (error) {
        console.error("Database Error in getWishlist:", error);
        return res.status(500).json({ error: "Failed to fetch wishlist", details: error.message });
    }
};

const handleCartQuantity = async (req, res) => {
    const { _id, role } = req.user;
    const { SellerInventoryID, newQuantity } = req.body;

    try {
        if (role !== 'Customer') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await pool.query(
            'UPDATE cart SET Quantity = ? WHERE SellerInventoryID = ? AND CustomerID = ?',
            [newQuantity, SellerInventoryID, _id]
        );

        res.status(200).json({ message: "Quantity changed successfully" });

    } catch (error) {
        console.error("Database Error in cart:", error);
        return res.status(500).json({ error: "Failed to change cart quantity", details: error.message });
    }
};

const getOrders = async (req, res) => {
    const { _id, role } = req.user;

    try {
        if (role !== 'Customer') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // 1. Get all orders for the customer
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE CustomerID = ? ORDER BY OrderDate DESC',
            [_id]
        );

        if (orders.length === 0) {
            return res.status(200).json([]);
        }

        const orderIds = orders.map(order => order.OrderID);

        // 2. Get order details
        const [orderDetails] = await pool.query(
            `SELECT * FROM orderdetails WHERE OrderID IN (${orderIds.map(() => '?').join(',')})`,
            orderIds
        );

        // 3. Get seller inventory data
        const sellerInventoryIds = orderDetails.map(od => od.SellerInventoryID);
        const [sellerInventories] = await pool.query(
            `SELECT SellerInventoryID, ProductID FROM sellerinventory WHERE SellerInventoryID IN (${sellerInventoryIds.map(() => '?').join(',')})`,
            sellerInventoryIds
        );

        const sellerInventoryMap = {};
        sellerInventories.forEach(item => {
            sellerInventoryMap[item.SellerInventoryID] = item.ProductID;
        });

        // 4. Get product details from inventory
        const productIds = [...new Set(Object.values(sellerInventoryMap))];
        const [products] = await pool.query(
            `SELECT ProductID, Name, Brand, images FROM inventory WHERE ProductID IN (${productIds.map(() => '?').join(',')})`,
            productIds
        );

        const productMap = {};
        products.forEach(product => {
            productMap[product.ProductID] = product;
        });

        // 5. Organize order details under their orders, with product info merged
        const orderDetailsMap = {};
        orderDetails.forEach(detail => {
            const productID = sellerInventoryMap[detail.SellerInventoryID];
            const productInfo = productMap[productID] || {};

            const combinedProduct = {
                OrderDetailID: detail.OrderDetailID,
                Price: detail.Price,
                Quantity: detail.Quantity,
                SellerInventoryID: detail.SellerInventoryID,
                ProductID: productID,
                Name: productInfo.Name || null,
                Brand: productInfo.Brand || null,
                images: productInfo.images || []
            };

            if (!orderDetailsMap[detail.OrderID]) {
                orderDetailsMap[detail.OrderID] = [];
            }
            orderDetailsMap[detail.OrderID].push(combinedProduct);
        });

        // 6. Build final structured order list
        const structuredOrders = orders.map(order => ({
            ...order,
            Products: orderDetailsMap[order.OrderID] || []
        }));

        return res.status(200).json(structuredOrders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const cancelOrder = async (req, res) => {
    const { _id } = req.user;
    const orderId = req.params.orderId;
  
    try {
      const [userRows] = await pool.query(
        'SELECT CustomerID FROM orders WHERE OrderID = ?',
        [orderId]
      );
  
      if (!userRows.length) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      if (userRows[0].CustomerID !== _id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      await pool.query(
        "UPDATE orders SET OrderStatus = 'Cancelled' WHERE OrderID = ?",
        [orderId]
      );
  
      res.status(200).json({ message: "Order cancelled" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error occurred while cancelling the order" });
    }
};
  
const getAllCustomers = async (req, res) => {
  const { _id } = req.user;

  try {
    // Step 1: Verify admin role
    const [adminRows] = await pool.query(
      'SELECT Role FROM admins WHERE UserID = ?',
      [_id]
    );

    const adminRole = adminRows?.[0]?.Role;
    if (!adminRole || (adminRole !== "SuperAdmin" && adminRole !== "Customer Support")) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Step 2: Get all customers
    const [customerRows] = await pool.query('SELECT * FROM Customers');
    const userIds = customerRows.map(user => user.CustomerID);

    if (!userIds.length) {
      return res.status(200).json([]); // No customers
    }

    // Step 3: Get user details
    const [userRows] = await pool.query(
      `SELECT * FROM users WHERE UserID IN (${userIds.map(() => '?').join(',')})`,
      userIds
    );

    // Step 4: Get all addresses for these users
    const [addressRows] = await pool.query(
      `SELECT * FROM address WHERE UserID IN (${userIds.map(() => '?').join(',')})`,
      userIds
    );

    // Step 5: Merge everything
    const customerData = customerRows.map(customer => {
      const userInfo = userRows.find(user => user.UserID === customer.CustomerID);
      const addresses = addressRows.filter(addr => addr.UserID === customer.CustomerID);

      return {
        ...customer,
        user: userInfo || null,
        addresses: addresses || [],
      };
    });

    return res.status(200).json(customerData);

  } catch (err) {
    console.error("Error fetching customers:", err);
    return res.status(500).json({ error: "Error occurred while fetching customers" });
  }
};

const updateCustomerStatus = (req, res) => {
  const customerId = req.params.id;
  const { status } = req.body;
  // Validate input
  const validStatuses = ['Active', 'Deactive', 'Ban'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const sql = 'UPDATE customers SET Status = ? WHERE CustomerID = ?';

  pool.query(sql, [status, customerId], (err, result) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Status updated successfully' });
  });
};

module.exports = {
    CustomerRegister,
    CustomerLogin,
    CustomerDetails,
    isWishlisted,
    handleWishlist,
    removeFromWishlist,
    isCarted,
    handleCart,
    getCart,
    getWishlist,
    handleCartQuantity,
    getOrders,
    cancelOrder,
    getAllCustomers,
    updateCustomerStatus,
}