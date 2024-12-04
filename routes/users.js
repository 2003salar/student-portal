const express = require('express');
const router = express.Router();
const isUserAuthenticated = require('../helpers/isUserAuthenticated');
const isUserAdmin = require('../helpers/isUserAdmin');
const { Users } = require('../models');

// USER PATH
// Get a user by its id
router.get('/:id', isUserAuthenticated, async (req, res) => {
    try {
        let { id } = req.params;
        if (isNaN(id)) {
            return res.status(500).json({success: false, message: 'Invalid id'});
        }
        id = parseInt(id);

        const user = await Users.findByPk(id, {
            attributes: ['id', 'firstName', 'lastName', 'dob', 'email', 'createdAt']
        });

        if (!user) {
            return res.status(400).json({success: false, message: 'User not found'});
        }
        return res.status(200).json({success: true, user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
        
    }
});

// ADMIN PATH
// Get all users as admin
router.get('/', isUserAuthenticated, isUserAdmin, async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'firstName', 'lastName', 'dob', 'email', 'createdAt', 'updatedAt']
        });
        console.log(req.user.isAdmin);
        return res.status(200).json({success: true, users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

module.exports = router;