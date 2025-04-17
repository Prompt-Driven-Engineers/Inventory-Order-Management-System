const express = require('express');
const { checkAuth, handleLogout } = require('../Authntication/UserAuthn');
const router = express.Router();

router.get('/check-auth', checkAuth);
router.post('/logout', handleLogout);

module.exports = router;