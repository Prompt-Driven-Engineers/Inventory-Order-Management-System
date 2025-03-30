const bcrypt = require('bcryptjs');
const pool = require('../db/db_connection');
const {setUser, getUser} = require('../Authntication/UserAuthn');


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
        const token = setUser({ UserID, Email });

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
        const adminQuery = `SELECT Role, Permission FROM admins WHERE UserID = ?`;
        const [adminResults] = await pool.execute(adminQuery, [_id]);

        // Merge results
        const adminData = {
            name: userResults[0].Name,  
            email: userResults[0].Email,
            phone: userResults[0].Phone,
            Role: adminResults[0].Role,
            Permission: adminResults[0].Permission
        };
        
        res.status(200).json(adminData);
        
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Failed to fetch", details: error.message });
    }
};

module.exports = {
    AdminLogin,
    AdminDetails
}