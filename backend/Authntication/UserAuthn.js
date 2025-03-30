const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const setUser = ({UserID, Email}) => {
    return jwt.sign(
        {
            _id: UserID,
            email: Email
        },
        secretKey
    );
};

// const setAdmin = ({UserID, AdminId}) => {
//     return jwt.sign(
//         {
//             _id: UserID,
//             email: Email
//         },
//         secretKey
//     );
// };

const getUser = (token) => {
    if(!token) return null;
    try {
        return jwt.verify(token, secretKey);
    } catch(error) {
        return null;
    } 
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('No token');
        return res.status(403).json({ error: "Unauthorized" });
    }
    req.user = getUser(token); // Extract user from token

    if (!req.user) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
};

module.exports = {
    setUser,
    getUser,
    verifyToken,
}