const { json } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');

// @route   GET api/check-auth
// @desc    Check auth of user
// @access  Publick
router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then( user => {
            if(!user) return res.status(401).json({ error: `no authorized ${req.user.id}`});

            res.json( { user: {
                id: user.id,
                name: user.name,
                email: user.email
            } });
        })
});

module.exports = router;