const jwt = require('jsonwebtoken');
const secretKey = 'ar541ju$$n@39';
const setUser = ({UserID, Email}) => {
    return jwt.sign(
        {
            _id: UserID,
            email: Email
        },
        secretKey
    );
};

const getUser = (token) => {
    if(!token) return null;
    try {
        return jwt.verify(token, secretKey);
    } catch(error) {
        return null;
    }
    
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
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