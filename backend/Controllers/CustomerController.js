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

const CustomerDetails = async (req, res) => {
    const { _id, Email } = req.user;

    try {
        // Fetch user details directly using pool (no manual connection)
        const userQuery = `SELECT Name, Email, Phone  FROM users WHERE UserID = ?`;
        const [userResults] = await pool.execute(userQuery, [_id]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch store details
        const [CustomerAddress] = await pool.query(`SELECT * FROM address WHERE UserID = ?`,
            [_id]
        );

        // Merge results
        const customerData = {
            name: userResults[0].Name,  
            email: userResults[0].Email,
            phone: userResults[0].Phone,
            address: {
                Landmark: CustomerAddress.length > 0 ? CustomerAddress[0].Landmark : null,
                Street: CustomerAddress.length > 0 ? CustomerAddress[0].Street : null,
                City: CustomerAddress.length > 0 ? CustomerAddress[0].City : null,
                State: CustomerAddress.length > 0 ? CustomerAddress[0].State : null,
                Country: CustomerAddress.length > 0 ? CustomerAddress[0].Country : null,
                Zip: CustomerAddress.length > 0 ? CustomerAddress[0].Zip : null,
                AddressType: CustomerAddress.length > 0 ? CustomerAddress[0].AddressType : null,
            }
        };
        
        res.status(200).json(customerData);
        
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to fetch", details: error.message });
    }
};

module.exports = {
    CustomerRegister,
    CustomerLogin,
    CustomerDetails,

}