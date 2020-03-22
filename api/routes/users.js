const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        // If user is taken. Email found in db
        // If not found. returns empty array, thats why length
        if (user.length >= 1) {
            // conflict 409
            return res.status(409).json({
                message: 'Email already exists'
            });
        } else {
            // if hashing the password was succesfull
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hashedPassword
                    });
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created succesfully',
                                user: result
                            });
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        })
                }
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


/** Login user
 * 
 */
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        // If there is no user by given email
        if (user.length < 1) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        // then block, user returns array
        bcrypt.compare(req.body.password, user[0].password, (err, response) => {
            if (err) {
                return res.status(401).json({ message: 'Auth failed' });
            }
            // if successful AKA if given password matches hashed password in db
            if (response) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                    // CHANGE TO ENV VARIABLE
                    'secret',
                    {
                        expiresIn: '1h'
                    });

                return res.status(200).json({ message: 'Auth successful', token: token });
            }
            // If given password was incorrect
            return res.status(401).json({ message: 'Auth failed' });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


/** Delete user
 * 
 */
router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId }).then(result => {
        res.status(200).json({
            message: 'User deleted succesfully'
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;