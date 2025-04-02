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

        // Step 2: Insert into Sellers table
        await connection.query(
            `INSERT INTO sellers (SellerID, StoreName, StoreDetails, PAN, AccountNo, IFSC) VALUES (?, ?, ?, ?, ?, ?)`,
            [UserID, StoreName, storeDesc, PAN, BankAccount.AccountNo, BankAccount.IFSC]
        );

        // Step 3: Insert into Addresses table
        await connection.query(
            `INSERT INTO address (UserID, Landmark, Street, City, State, Country, ZIP, AddressType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [UserID, Address.Landmark, Address.Street, Address.City, Address.State, Address.Country, Address.ZIP, Address.AddressType]
        );

        const hashedPassword = await bcrypt.hash(PasswordHash, 10);

        // Step 4: Insert into Passwords table
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

module.exports = { SellerRegister, SellerLogin, SellerDetails, AddProduct };