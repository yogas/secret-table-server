const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const signUser = require('../../utils/sign-user');

// User Model
const User = require('../../models/user');

// @route   POST api/users/auth
// @desc    Auth user
// @access  Public
router.post('/', (req, res) => {
    const {email, password} = req.body;

    // Validation
    if(!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields'});
    }

    User.findOne({email})
        .then( user => {
            if(!user) return res.status(400).json({ msg: 'User does not exists'});

            bcrypt.compare(password, user.password)
                .then( isMacth => {
                    if(!isMacth) return res.status(400).json({ msg: 'Invalid password' });
                    signUser(user, res);
                });            
        });
})

module.exports = router;