const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const signUser = require('../../utils/sign-user');

// User Model
const User = require('../../models/user');

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
    const {name, email, password} = req.body;

    // Validation
    if(!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields'});
    }

    User.findOne({email})
        .then( user => {
            if(user) return res.status(400).json({ msg: 'User already exists'});

            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then( user => {
                            signUser(user, res);
                        })
                })
            })
        });
})

module.exports = router;