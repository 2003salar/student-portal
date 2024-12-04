const express = require('express')
const router = express.Router();
const Users = require('../models')
const bcrypt = require('bcrypt')
const validator = require('validator')
const passport = require('passport');
const isUserAuthenticated = require('../helpers/isUserAuthenticated');
require('../helpers/passportConfig');

router.get('/', async (req, res)=> {
    try {
        const users = await Users.findAll();
        res.json({ users }); 
        
    } catch (error) {
        console.log(error);         
    }
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, dob, password1, password2, email } = req.body;
        console.log(firstName, lastName, dob, password1, password2, email);
        
        // Check if the data are not missing
        if (!firstName || !lastName || !dob || !password1 || !password2 || !email) {
            return res.status(400).json({success: false, message: "Missing the required fields"});
        } 
        // Validate the date
        if (!validator.isDate(dob)) {
            return res.status(400).json({success: false, message: "Invalid date of birth"});
        }
        // Validate the email 
        if (!validator.isEmail(email)) {
            return res.status(400).json({success: false, message: "Invalid email"});
        }
        // Validate the passwords
        if (password1 !== password2) {
            return res.status(400).json({success: false, message: "Passwords do not match"})
        }
        if (!validator.isStrongPassword(password1)) {
            return res.status(400).json({success: false, message: "Your password is not strong"});
        }
        // Check if the user already exists
        const user = await Users.findOne({ 
            where: {
                email
            }
        });
        if (user) {
            return res.status(400).json({success: false, message: "Email is already registered"})
        }
        // Create the new user
        const newUser = await Users.create({
            firstName,
            lastName, 
            dob,
            password_hash: await bcrypt.hash(password1, 10),
            email,
        })
        return res.status(201).json({message: "Successful registration!"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
        
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({success: true, message: 'Successfully logged in'});
});

router.get('/logout', isUserAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({success: false, message: 'Logout failed'});
        }
        return res.status(200).json({success: true, message: 'You are logged out successfully'});
    });
});

module.exports = router;