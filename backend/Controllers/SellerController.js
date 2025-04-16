const bcrypt = require('bcryptjs');
const pool = require('../db/db_connection');
const {setUser, getUser} = require('../Authntication/UserAuthn');

const SellerRegister = async (req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    try {
        const { Name, Email, Phone, Phone2, StoreName, storeDesc, PAN, Address, BankAccount, PasswordHash } = req.body;
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
            [UserID, "Seller"]
        );

        // Step 3: Insert into Sellers table
        await connection.query(
            `INSERT INTO sellers (SellerID, StoreName, StoreDetails, PAN, AccountNo, IFSC) VALUES (?, ?, ?, ?, ?, ?)`,
            [UserID, StoreName, storeDesc, PAN, BankAccount.AccountNo, BankAccount.IFSC]
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

const SellerLogin = async (req, res) => {
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
        const token = setUser({ UserID, Email });

        // **Step 5: Set cookie and send response**
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful", UserID });

    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    } finally {
        connection.release(); // Ensure the connection is released
    }
};

const SellerDetails = async (req, res) => {
    const { _id, Email } = req.user;

    try {
        // Fetch user details directly using pool (no manual connection)
        const userQuery = `SELECT Name, Email, Phone  FROM users WHERE UserID = ?`;
        const [userResults] = await pool.execute(userQuery, [_id]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch store details
        const sellerQuery = `SELECT storename, accountno, ifsc FROM sellers WHERE SellerID = ?`;
        const [sellerResults] = await pool.execute(sellerQuery, [_id]);

        // Merge results
        const sellerData = {
            name: userResults[0].Name,  
            email: userResults[0].Email,
            phone: userResults[0].Phone,
            storename: sellerResults.length > 0 ? sellerResults[0].storename : null,
            accountno: sellerResults.length > 0 ? sellerResults[0].accountno : null,
            ifsc: sellerResults.length > 0 ? sellerResults[0].ifsc : null
        };
        
        res.status(200).json(sellerData);
        
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to fetch", details: error.message });
    }
};

const AddProduct = async (req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    try {
        // Extract uploaded image paths
        const imagePaths = req.files.map(file => `/data/phonephoto/${file.filename}`);

        // Get other form data from request body
        const { Name, Description, Price, Discount, Category, ProductType, Quantity, Specifications } = req.body;

        // Ensure Specifications is stored as JSON
        const specificationsJSON = JSON.stringify(Specifications);

        // **Get SellerId from `req.user` instead of frontend**
        const SellerId = req.user._id;

        const [sellerRslt] = await connection.query(
            `SELECT UserType FROM usertypes WHERE UserID = ?`,
            [SellerId]  // Make sure to pass SellerId inside an array as it's a query parameter
        );

        if (sellerRslt.length === 0 || sellerRslt[0].UserType !== "Seller") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Insert into inventory
        const [inventoryRslt] = await connection.query(
            `INSERT INTO inventory (Name, Description, Category, ProductType, Specifications, images)
             VALUES (?, ?, ?, ?, ?, ?)`, 
            [Name, Description, Category, ProductType, specificationsJSON, JSON.stringify(imagePaths)]
        );

        const ProductId = inventoryRslt.insertId; // Get Product ID

        // Insert into sellerinventory
        await connection.query(
            `INSERT INTO sellerinventory (ProductID, SellerID, Price, Discount, Quantity, CurrentStock) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [ProductId, SellerId, Price, Discount, Quantity, Quantity]
        );

        await connection.commit(); // Commit transaction
        res.status(200).json({ message: "Product added successfully!", productId: ProductId });

    } catch (error) {
        await connection.rollback(); // Rollback if anything fails
        res.status(500).json({ error: "Product add failed", details: error.message });
    } finally {
        connection.release(); // Ensure the connection is released
    }
};

const SellerList = async (req, res) => {
    const { _id, email } = req.user;
    
    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (adminRows.length === 0 || 
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get list of all sellers
        const [sellers] = await pool.query(
            'SELECT * FROM sellers'
        );

        // Extract UserIDs from the sellers table
        const userIds = sellers.map(seller => seller.SellerID);
        if (userIds.length === 0) {
            return res.status(200).json({ sellers: [] });
        }

        // Fetch user details for those UserIDs
        const [userDetails] = await pool.query(
            `SELECT UserID, Name, Email, Phone, CreatedAt, LastLogin 
             FROM users 
             WHERE UserID IN (?)`,
            [userIds]
        );

        // Merge admin and user details
        const sellerList = sellers.map(seller => {
            const user = userDetails.find(user => user.UserID === seller.SellerID);
            return { ...seller, ...user };
        });

        res.status(200).json({ sellers: sellerList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch seller list" });
    }
};

const PendingSellers = async (req, res) => {
    const { _id, email } = req.user;
    
    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (adminRows.length === 0 || 
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get list of all sellers
        const [sellers] = await pool.query(
            'SELECT * FROM sellers WHERE Status = ?',
            'Pending'
        );

        // Extract UserIDs from the sellers table
        const userIds = sellers.map(seller => seller.SellerID);
        if (userIds.length === 0) {
            return res.status(200).json({ sellers: [] });
        }

        // Fetch user details for those UserIDs
        const [userDetails] = await pool.query(
            `SELECT UserID, Name, Email, Phone, CreatedAt, LastLogin 
             FROM users 
             WHERE UserID IN (?)`,
            [userIds]
        );

        // Merge admin and user details
        const sellerList = sellers.map(seller => {
            const user = userDetails.find(user => user.UserID === seller.SellerID);
            return { ...seller, ...user };
        });

        res.status(200).json({ sellers: sellerList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch seller list" });
    }
};

const ModifySellerStatus = async (req, res) => {
    const { _id } = req.user;
    const { SellerID, newStatus } = req.body; // Receiving AdminID and new Role from frontend

    try {
        // Get role of the logged-in user
        const [adminRows] = await pool.query(
            'SELECT Role FROM admins WHERE UserID = ?',
            [_id]
        );

        if (adminRows.length === 0 || 
            (adminRows[0].Role !== "SuperAdmin" && adminRows[0].Role !== "Seller Administrator")) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update role where AdminID matches
        await pool.query(
            'UPDATE sellers SET Status = ? WHERE SellerID = ?',
            [newStatus, SellerID]
        );

        res.status(200).json({ message: "Sellers status updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update Sellers status" });
    }
};

const AddExisProduct = async(req, res) => {
    const { _id } = req.user;
    const { ProductID, SellerID, Price, Discount, Quantity } = req.body;
    try {
        // Get role of the logged-in user
        const [sellerRows] = await pool.query(
            'SELECT Status FROM sellers WHERE SellerID = ?',
            [_id]
        );

        if (sellerRows.length === 0) {
            return res.status(403).json({ message: "Unauthorized" });
        } else if(sellerRows[0].Status !== "Active") {
            return res.status(403).json({ message: `Seller status is ${sellerRows[0].Status}`});
        }

        const query = `
            INSERT INTO sellerinventory (ProductID, SellerID, Price, Discount, Quantity, CurrentStock)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await pool.execute(query, [ProductID, _id, Price, Discount, Quantity, Quantity]);
        res.status(200).json({ message: "Product added successfully" });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Failed to add product" });
    }
}

module.exports = 
{   SellerRegister, 
    SellerLogin,
    SellerDetails, 
    AddProduct, 
    SellerList, 
    PendingSellers,
    ModifySellerStatus,
    AddExisProduct,
};