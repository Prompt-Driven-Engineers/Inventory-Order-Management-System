const { getUser } = require('../Authntication/UserAuthn');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    req.user = getUser(token); // ✅ Extract user from token

    if (!req.user) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
};

