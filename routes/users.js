const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isUserAuthenticated = require('../helpers/isUserAuthenticated');
const isUserAdmin = require('../helpers/isUserAdmin');
const { Users } = require('../models');
const { isStrongPassword } = require('validator');
const { where } = require('sequelize');

// USER PATH
// Get a user by its id
router.get('/:id', isUserAuthenticated, async (req, res) => {
    try {
        let { id } = req.params;
        if (isNaN(id)) {
            return res.status(500).json({success: false, message: 'Invalid id'});
        }
        id = parseInt(id);

        // Remove password hash from the return value
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

// USER PATH
// Update the password
router.patch('/:id', isUserAuthenticated, async (req, res) => {
    try {
        let { id } = req.params;
        if (isNaN(id)) {
            return res.status(500).json({success: false, message: 'Invalid id'});
        }
        id = parseInt(id);

        const user = await Users.findByPk(id);

        if (!user) {
            return res.status(400).json({success: false, message: 'User not found'});
        }
        if (user.id !== req.user.id) {
            return res.status(403).json({success: false, message: 'You are unauthorized to access this route'});
        }

        const { new_password } = req.body;
        if (!new_password || !isNaN(new_password)) {
            return res.status(400).json({success: false, message: 'Invalid password'})
        }
        if (!isStrongPassword(new_password)) {
            return res.status(400).json({success: false, message: 'Your new password is not strong'});
        }
        if (await bcrypt.compare(new_password, req.user.password_hash)) {
            return res.status(400).json({success: false, message: 'Cannot set the new password as your current password'});
        }

        const password_hash = await bcrypt.hash(new_password, 10);

        await Users.update({password_hash}, {
            where: {
                id
            }
        });

        return res.status(200).json({success: true, message: 'Password was changed successfully'});
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
            attributes: ['id', 'firstName', 'lastName', 'dob', 'email', 'createdAt', 'updatedAt', 'isAdmin']
        });
        console.log(req.user.isAdmin);
        return res.status(200).json({success: true, users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

// ADMIN PATH
// Update a user's data without their password
router.patch('/admin/:id', isUserAuthenticated, isUserAdmin, async (req, res) => {
    try {
        let { id } = req.params;
        if (isNaN(id)) {
            return res.status(500).json({success: false, message: 'Invalid id'});
        }
        id = parseInt(id);

        const user = await Users.findByPk(id);

        if (!user) {
            return res.status(400).json({success: false, message: 'User not found'});
        }

        const updatedData = {...req.body};
        delete updatedData.createdAt;
        delete updatedData.updatedAt;
        delete updatedData.password_hash;

        await Users.update(updatedData, {
            where: {
                id
            }
        });
        const same_user = await Users.findByPk(id, {
            attributes: ['id', 'firstName', 'lastName', 'dob', 'email', 'createdAt', 'updatedAt']
        })
        return res.status(200).json({success: true, message: 'Data was updated successfully', user: same_user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
        
    }
});

// ADMIN PATH
// Delete a user
router.delete('/:id', isUserAuthenticated, isUserAdmin, async(req, res) => {
    try {
        let { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid id'});
        }
        id = parseInt(id);
        const user = Users.findByPk(id);
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        const deleteCount = await Users.destroy({
            where: {
                id,
            }
        });

        if (deleteCount) {
            return res.status(200).json({ success: true, message: 'User was successfully deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});
module.exports = router;