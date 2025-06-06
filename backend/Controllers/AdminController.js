const bcrypt = require('bcryptjs');
const pool = require('../db/db_connection');
const {setUser, getUser} = require('../Authntication/UserAuthn');

// Function to generate Admin ID based on the specified format (ADM + 2 digits + 2 letters + 2 digits + 2 letters)
const generateAdminId = () => {
    const randomDigits1 = Math.floor(10 + Math.random() * 90); // Ensures 2-digit number (10-99)
    const randomLetters1 = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                           String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 2 uppercase letters (A-Z)
    const randomDigits2 = Math.floor(10 + Math.random() * 90); // Another 2-digit number
    const randomLetters2 = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                           String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Another 2 uppercase letters

    return `ADM${randomDigits1}${randomLetters1}${randomDigits2}${randomLetters2}`;
};

// Function to generate a unique Admin ID that doesn't exist in the database
const generateUniqueAdminId = async (connection) => {
    let adminId;
    let exists = true;

    // Keep generating the Admin ID until it doesn't exist in the database
    while (exists) {
        adminId = generateAdminId();

        // Check if the Admin ID already exists in the database
        const [existingAdmin] = await connection.query(
            'SELECT AdminID FROM admins WHERE AdminID = ?',
            [adminId]
        );

        // If the Admin ID doesn't exist, we can exit the loop
        exists = existingAdmin.length > 0;
    }

    return adminId;
};


const AdminRegister = async(req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {

        // Check if SuperAdmin is valid
        const {_id, email} = req.user;

        const [sAdminRslt] = await connection.query(
            `SELECT Role FROM admins WHERE UserID = ?`,
            _id
        );

        if(sAdminRslt.length == 0 || sAdminRslt[0].Role != "SuperAdmin") {
            return res.status(403).json({message: "Unauthorized"});
        }

        // Getting data from frontend
        const { Name, Email, Phone, Phone2, PANID, ADHARID, Address, Role } = req.body;
        const phone2 = req.body.Phone2.trim() === "" ? null : req.body.Phone2;

        // Insert into users table
        const [userResult] = await connection.query(
            `INSERT INTO users (Name, Email, Phone, Phone2) VALUES (?, ?, ?, ?)`,
            [Name, Email, Phone, phone2]
        );
        
        const UserID = userResult.insertId; // Get generated UserID

        // Insert into address table
        await connection.query(
            `INSERT INTO address (UserID, Landmark, Street, City, State, Country, ZIP, AddressType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [UserID, Address.Landmark, Address.Street, Address.City, Address.State, Address.Country, Address.ZIP, Address.AddressType]
        );

        // Insert into UserTypes table
        await connection.query(
            `INSERT INTO usertypes (UserID, UserType) VALUES (?, ?)`,
            [UserID, "Admin"]
        );

        const AdminId = await generateUniqueAdminId(connection); // Generate a unique Admin ID

        // Inset into admins table
        await connection.query(
            `INSERT INTO admins (AdminID, UserID, Role, AdharID, PANID) VALUES (?, ?, ?, ?, ?)`,
            [AdminId, UserID, Role, ADHARID, PANID]
        );

        const hashedPassword = await bcrypt.hash(AdminId, 10); // encrypt password

        await connection.query(
            `INSERT INTO adminpasswords (UserID, PasswordHash) VALUES (?, ?)`,
            [UserID, hashedPassword]
        );

        await connection.commit(); // commit transaction
        connection.release();

        res.status(201).json({ message: 'Admin registered successfully', AdminId });

    } catch(error) {
        await connection.rollback(); // Rollback transaction on error
        connection.release();
        console.log(error.message);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

const AdminLogin = async (req, res) => {
    const { AdminId, Password } = req.body;
    const connection = await pool.getConnection();

    try {
        // **Step 1: Check if AdminId exists and retrieve UserID**
        const [adminRows] = await connection.query(
            `SELECT UserID FROM admins WHERE AdminId = ?`, 
            [AdminId]
        );

        if (adminRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const UserID = adminRows[0].UserID;

        // **Step 2: Retrieve hashed password from passwords table**
        const [passwordRows] = await connection.query(
            `SELECT PasswordHash FROM adminpasswords WHERE UserID = ?`,
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

        const [emailRows] = await connection.query(
            `SELECT Email FROM users WHERE UserID = ?`, [UserID]
        );

        const Email = emailRows[0].Email;
        // **Step 4: Generate JWT token using setUser**
        const token = setUser({ UserID, Email, Role: 'Admin' });

        // **Step 5: Set cookie and send response**
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    } finally {
        connection.release(); // Ensure the connection is released
    }
};

const AdminDetails = async (req, res) => {
    const { _id, Email } = req.user;

    try {
        // Fetch user details directly using pool (no manual connection)
        const userQuery = `SELECT Name, Email, Phone  FROM users WHERE UserID = ?`;
        const [userResults] = await pool.execute(userQuery, [_id]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch store details
        const adminQuery = `SELECT Role, AccountStatus FROM admins WHERE UserID = ?`;
        const [adminResults] = await pool.execute(adminQuery, [_id]);

        // Merge results
        const adminData = {
            name: userResults[0].Name,  
            email: userResults[0].Email,
            phone: userResults[0].Phone,
            Role: adminResults[0].Role,
            AccountStatus: adminResults[0].AccountStatus,
        };
        
        res.status(200).json(adminData);
        
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to fetch", details: error.message });
    }
};

const AdminList = async (req, res) => {
    const { _id, email } = req.user;
    
    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (!adminRows.length || adminRows[0].Role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get list of all admins
        const [admins] = await pool.query(
            'SELECT AdminID, UserID, Role, AccountStatus, AdharID, PANID FROM admins'
        );

        // Extract UserIDs from the admins table
        const userIds = admins.map(admin => admin.UserID);
        if (userIds.length === 0) {
            return res.status(200).json({ admins: [] });
        }

        // Fetch user details for those UserIDs
        const [userDetails] = await pool.query(
            `SELECT UserID, Name, Email, Phone, CreatedAt, LastLogin 
             FROM users 
             WHERE UserID IN (?)`,
            [userIds]
        );

        // Merge admin and user details
        const adminList = admins.map(admin => {
            const user = userDetails.find(user => user.UserID === admin.UserID);
            return { ...admin, ...user };
        });

        res.status(200).json({ admins: adminList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch admin list" });
    }
};

const AdminListMod = async (req, res) => {
    const { _id, email } = req.user;
    
    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (!adminRows.length || adminRows[0].Role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get admin details + Name from users table
        const [adminList] = await pool.query(
            `SELECT 
                a.AdminID, a.Role, a.AccountStatus, 
                u.Name 
            FROM admins a
            JOIN users u ON a.UserID = u.UserID
            WHERE a.Role != "SuperAdmin"`
        );

        res.status(200).json({ admins: adminList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch admin list" });
    }
};

const ModifyRole = async (req, res) => {
    const { _id } = req.user;
    const { AdminID, newRole } = req.body; // Receiving AdminID and new Role from frontend

    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (!adminRows.length || adminRows[0].Role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Prevent modifying another SuperAdmin
        const [targetAdmin] = await pool.query(
            'SELECT Role FROM admins WHERE AdminID = ?',
            [AdminID]
        );

        if (targetAdmin.length && targetAdmin[0].Role === "SuperAdmin") {
            return res.status(403).json({ message: "Cannot modify another SuperAdmin" });
        }

        // Update role where AdminID matches
        await pool.query(
            'UPDATE admins SET Role = ? WHERE AdminID = ?',
            [newRole, AdminID]
        );

        res.status(200).json({ message: "Admin role updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update admin role" });
    }
};

const ModifyStatus = async (req, res) => {
    const { _id } = req.user;
    const { AdminID, newAccountStatus } = req.body; // Receiving AdminID and new Role from frontend

    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (!adminRows.length || adminRows[0].Role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Prevent modifying another SuperAdmin
        const [targetAdmin] = await pool.query(
            'SELECT Role FROM admins WHERE AdminID = ?',
            [AdminID]
        );

        if (targetAdmin.length && targetAdmin[0].Role === "SuperAdmin") {
            return res.status(403).json({ message: "Cannot modify another SuperAdmin" });
        }

        // Update role where AdminID matches
        await pool.query(
            'UPDATE admins SET AccountStatus = ? WHERE AdminID = ?',
            [newAccountStatus, AdminID]
        );

        res.status(200).json({ message: "Admin accountStatus updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update admin accountStatus" });
    }
};

const fetchSellerInventory = async (req, res) => {
    const { _id } = req.user;

    try {
        // Step 1: Check admin role
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (
            !adminRows.length ||
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Step 2: Get seller inventory
        const [inventoryRows] = await pool.query('SELECT * FROM sellerInventory ORDER BY AddedAt DESC');
        if (!inventoryRows.length) {
            return res.json([]);
        }

        const productIds = inventoryRows.map(item => item.ProductID);
        const sellerIds = [...new Set(inventoryRows.map(item => item.SellerID))]; // Unique SellerIDs

        // Step 3: Get product details
        const [productDetails] = await pool.query(
            `SELECT * FROM inventory WHERE ProductID IN (${productIds.map(() => '?').join(',')})`,
            productIds
        );

        // Step 4: Get seller info (StoreName)
        const [sellerDetails] = await pool.query(
            `SELECT SellerID, StoreName FROM sellers WHERE SellerID IN (${sellerIds.map(() => '?').join(',')})`,
            sellerIds
        );

        // Step 5: Merge all data
        const mergedData = inventoryRows.map(item => {
            const product = productDetails.find(p => p.ProductID === item.ProductID);
            const seller = sellerDetails.find(s => s.SellerID === item.SellerID);

            return {
                ...item,
                ...(product ? {
                    Name: product.Name,
                    Description: product.Description,
                    images: product.images
                } : {}),
                ...(seller ? { StoreName: seller.StoreName } : {})
            };
        });

        return res.json(mergedData);
    } catch (err) {
        console.error("Error fetching seller inventory:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateInventoryStatus = async (req, res) => {
    const { _id } = req.user;
    const { inventoryId } = req.params;
    const { status } = req.body;

    try {
        // Step 1: Check admin role
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (
            !adminRows.length ||
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Step 2: Validate status
        const validStatuses = ["Pending", "Approved", "Rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Step 3: Update inventory status and admin ID
        const [result] = await pool.query(
            'UPDATE sellerInventory SET Status = ?, AddedBy = ? WHERE SellerInventoryID = ?',
            [status, _id, inventoryId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        return res.json({ message: "Inventory status updated successfully" });

    } catch (err) {
        console.error("Error updating inventory status:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const fetchAllOrdersWithDetails = async (req, res) => {
    const { _id } = req.user;

    try {
        // Step 1: Check admin role
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (
            !adminRows.length ||
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Step 2: Get all orders sorted by OrderDate (latest first)
        const [orders] = await pool.query(`
            SELECT * FROM orders ORDER BY OrderDate DESC
        `);

        if (!orders.length) return res.json([]);

        // Step 3: Get all order details for these orders
        const orderIds = orders.map(order => order.OrderID);
        const [orderDetails] = await pool.query(
            `SELECT * FROM orderdetails WHERE OrderID IN (${orderIds.map(() => '?').join(',')})`,
            orderIds
        );

        // Step 4: Get product info from sellerInventory and inventory tables
        const inventoryIds = [...new Set(orderDetails.map(item => item.SellerInventoryID))];
        const [sellerInventories] = await pool.query(
            `SELECT * FROM sellerInventory WHERE SellerInventoryID IN (${inventoryIds.map(() => '?').join(',')})`,
            inventoryIds
        );
        const productIds = [...new Set(sellerInventories.map(inv => inv.ProductID))];
        const [products] = await pool.query(
            `SELECT ProductID, Name, Description, images FROM inventory WHERE ProductID IN (${productIds.map(() => '?').join(',')})`,
            productIds
        );

        // Step 5: Merge all data
        const detailedOrders = orders.map(order => {
            const orderItems = orderDetails
                .filter(od => od.OrderID === order.OrderID)
                .map(od => {
                    const sellerInventory = sellerInventories.find(inv => inv.SellerInventoryID === od.SellerInventoryID);
                    const product = products.find(p => p.ProductID === sellerInventory?.ProductID);

                    return {
                        ...od,
                        SellerInventory: sellerInventory || {},
                        Product: product || {},
                    };
                });

            return {
                ...order,
                items: orderItems
            };
        });

        return res.json(detailedOrders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const fetchReorderList = async (req, res) => {
    const { _id } = req.user;
    try {
        // 1. Check if user is SuperAdmin
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (!adminRows.length || adminRows[0].Role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // 2. Fetch total stock and quantity per product
        const [InventoryRows] = await pool.query(
            `SELECT ProductID, 
                    SUM(CurrentStock) AS TotalStock, 
                    SUM(Quantity) AS TotalQuantity 
             FROM SellerInventory 
             GROUP BY ProductID`
        );

        // 3. Filter products that need reorder
        const alertRows = InventoryRows.filter(row =>
            Number(row.TotalStock) <= 25
        );

        const ProductIDs = alertRows.map(alert => alert.ProductID);

        // 4. Fetch product details
        let mergedData = [];
        if (ProductIDs.length > 0) {
            const [productDetails] = await pool.query(
                `SELECT * FROM Inventory WHERE ProductID IN (${ProductIDs.map(() => '?').join(',')})`,
                ProductIDs
            );

            // 5. Merge data
            mergedData = alertRows.map(alert => {
                const product = productDetails.find(p => p.ProductID === alert.ProductID);
                return {
                    ...product,
                    TotalStock: Number(alert.TotalStock),
                    TotalQuantity: Number(alert.TotalQuantity)
                };
            });
        }

        // 6. Return final merged result
        return res.status(200).json(mergedData);

    } catch (err) {
        console.error("Error fetching Reorder List:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const fetchSellsDasboard = async(req, res) => {
    const { _id } = req.user;
    try {
        // Step 1: Check admin role
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (
            !adminRows.length ||
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const [summaryRows] = await pool.query(`
            SELECT 
                sellerInventory.ProductID,
                AVG(orderDetails.Price) AS AvgPrice,
                SUM(orderDetails.Quantity) AS TotalQuantity
            FROM 
                orderDetails
            JOIN 
                sellerInventory ON orderDetails.SellerInventoryID = sellerInventory.SellerInventoryID
            GROUP BY 
                sellerInventory.ProductID
        `);

        const ProductIDs = summaryRows.map(order => order.ProductID);

        const [productDetails] = await pool.query(
            `SELECT * FROM Inventory WHERE ProductID IN (${ProductIDs.map(() => '?').join(',')})`,
            ProductIDs
        );

        // Convert summaryRows to a map for fast lookup
        const summaryMap = new Map();
        summaryRows.forEach(row => {
            summaryMap.set(row.ProductID, {
                AvgPrice: row.AvgPrice,
                TotalQuantity: row.TotalQuantity
            });
        });

        // Merge productDetails with summary info
        const sellsData = productDetails.map(product => {
            const summary = summaryMap.get(product.ProductID) || { AvgPrice: 0, TotalQuantity: 0 };
            
            return {
                ...product,                // all fields from Inventory table
                AvgPrice: summary.AvgPrice,
                TotalQuantity: summary.TotalQuantity
            };
        });
        return res.status(200).json(sellsData);
    } catch (err) {
        console.error("Error fetching Sells List:", err);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    AdminLogin,
    AdminDetails,
    AdminRegister,
    AdminList,
    AdminListMod,
    ModifyRole,
    ModifyStatus,
    fetchSellerInventory,
    updateInventoryStatus,
    fetchAllOrdersWithDetails,
    fetchReorderList,
    fetchSellsDasboard,
}