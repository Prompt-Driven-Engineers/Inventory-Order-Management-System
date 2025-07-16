const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const setUser = ({UserID, Email, Role}) => {
    return jwt.sign(
        {
            _id: UserID,
            email: Email,
            role: Role
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

// GET /api/auth/check-auth
const checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ isLoggedIn: false });
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      res.json({ isLoggedIn: true, user: decoded });
    } catch (err) {
      return res.status(401).json({ isLoggedIn: false });
    }
}; 

const handleLogout = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Strict' // or 'Lax' based on your setup
    });
    return res.json({ message: 'Logged out successfully' });
};

module.exports = {
    setUser,
    getUser,
    verifyToken,
    checkAuth,
    handleLogout,
}