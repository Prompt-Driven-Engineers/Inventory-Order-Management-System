const bcrypt = require('bcryptjs');
const pool = require('../db/db_connection');
const {setUser, getUser} = require('../Authntication/UserAuthn');



const SellerRegister = async (req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    try {
        const { Name, Email, Phone, Phone2, StoreName, storeDesc, PAN, Address, BankAccount, PasswordHash } = req.body;

        // Step 1: Insert into Users table
        const [userResult] = await connection.query(
            `INSERT INTO users (Name, Email, Phone, Phone2) VALUES (?, ?, ?, ?)`,
            [Name, Email, Phone, Phone2]
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

const SellerDetails = (req, res) => {
    const { UserID } = req.params;
    console.log('Fetching seller details for UserID:', UserID);

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection error:", err);
            return res.status(500).json({ message: "Database connection error", error: err });
        }

        // Fetch user details from users table
        const userQuery = `SELECT Name, Email, Phone FROM users WHERE UserID = ?`;
        connection.query(userQuery, [UserID], (userErr, userResults) => {
            if (userErr) {
                connection.release();
                console.error("Error fetching user details:", userErr);
                return res.status(500).json({ message: "Database error", error: userErr });
            }

            if (userResults.length === 0) {
                connection.release();
                return res.status(404).json({ message: "User not found" });
            }

            // Fetch store details from sellers table
            const sellerQuery = `SELECT storename FROM sellers WHERE SellerID = ?`;
            connection.query(sellerQuery, [UserID], (sellerErr, sellerResults) => {
                connection.release(); // ✅ Release connection after queries

                if (sellerErr) {
                    console.error("Error fetching seller details:", sellerErr);
                    return res.status(500).json({ message: "Database error", error: sellerErr });
                }

                // Merge results
                const sellerData = {
                    name: userResults[0].name,
                    email: userResults[0].email,
                    phone: userResults[0].phone,
                    storename: sellerResults.length > 0 ? sellerResults[0].storename : null, // Handle if no store
                };

                console.log("Fetched seller data:", sellerData);
                res.status(200).json(sellerData);
            });
        });
    });
};


module.exports = { SellerRegister, SellerLogin, SellerDetails };










// authnRouter.get('/profile', isAuthenticated, (req, res) => {
//     console.log("Profile loading");
//     res.sendFile(path.join(__dirname, '../../profile.html'));
// })

// authnRouter.get('/profileData', isAuthenticated, setNoCache, (req, res) => {
//     if(req.session.loggedin) {
//         const userid = req.session.UserID;
//         db.query('select * from user where UserID = ?', [userid], (err, results, fields) => {
//             if(err) throw err;
//             if(results.length > 0) {
//                 // console.log(results[0]);
//                 res.send(results[0]);
//             } else {
//                 res.send("NotFound");
//             }
//         })
//     }
// });

// authnRouter.get('/maxSerial',(req, res) => {
//     // console.log(req.query);
//     const {find} = req.query;
//     const query = "SELECT MAX(CAST(SUBSTRING(UserID, -4) AS UNSIGNED)) AS maxSerial FROM user WHERE SUBSTRING(userID, 5, 7) = ?";
//     // const searchValue = `%${name}%`;
//     // console.log(name);

//     db.query(query, [find], (err, result) => {
//         if(err) {
//             throw err;
//         }
//         console.log(result);
//         res.send(result[0]);
//     });
// });

// authnRouter.get('/idData',(req, res) => {
//     // if(regStatus == 1) {
//         console.log(firstName);
//         res.send({Name: firstName,
//                     id: userid
//         });
//         // regStatus = 0;
    
// });

// authnRouter.get('/logout', isAuthenticated, (req, res) => {
//     req.session.destroy((err) => {
//         if(err) {
//             return res.send('uLogout');
//         }
//         console.log('Logout successfull');
//         res.send("sLogout");
//     });
// });

// authnRouter.get('/check-auth', (req, res) => {
//     if(req.session.UserID) {
//         res.sendStatus(200);
//     } else {
//         res.sendStatus(401);
//     }
// });

// authnRouter.post('/updateProfile', isAuthenticated, (req, res) => {
//     const { UserID, Depertment, semester, phone, Email } = req.body;
//     // Update user profile in the database
//     const sql = `UPDATE user SET Depertment = ?, semester = ?, phone = ?, Email = ? WHERE UserID = ?`;
//     const values = [Depertment, semester, phone, Email, UserID];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.send({ success: false, message: 'Database error' });
//         }

//         if (result.affectedRows === 0) {
//             return res.send({ success: false, message: 'User not found' });
//         }

//         res.send({ success: true, message: 'Profile updated successfully' });
//     });
// });

// authnRouter.post('/reqBook', isAuthenticated, (req, res) => {
//     const {BookID} = req.body;
//     console.log(BookID);
//     const id = req.session.UserID;
//     console.log(id);
//     db.query('insert into reqbook(UserID, BookID) values(?, ?)', [id, BookID], (err, result) => {
//         if(err) {
//             console.log(err);
//             res.send('NO');
//             return;
//         };
//         res.send('OK');
//     });
// });

// module.exports = authnRouter;