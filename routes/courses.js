const express = require('express');
const router = express.Router();
const { Courses } = require('../models');
const isUserAuthenticated = require('../helpers/isUserAuthenticated');
const isUserAdmin = require('../helpers/isUserAdmin');

// USER PATH AND ADMIN PATH
// GET ALL COURSES
router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const courses = await Courses.findAll()
        return res.status(200).json({success: true, courses});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

// ADMIN PATH 
// CREATE A COURSE
router.post('/', isUserAuthenticated, isUserAdmin, async (req, res) => {
    try {
        let { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({success: false, message: 'Required data is missing'})
        }
        name = name.toLowerCase().trim();
        console.log(name);
        const course = await Courses.findOne({
            where: {
                name,
            }
        });
        if (course) {
            return res.status(400).json({success: false, message: 'Course already exists', course});
        } 
        const newCourse = await Courses.create({
            name,
            description,
        });
        return res.status(201).json({success: true, message: 'Course created', newCourse});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

// ADMIN PATH
// EDIT A COURSE
router.patch('/:id', isUserAuthenticated, isUserAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid course id'});
        }
        const course = await Courses.findByPk(id);
        if (!course) {
            return res.status(404).json({success: false, message: 'Course not found'});
        }
        const updatedParts = {...req.body};
        if ("name" in updatedParts) {
            updatedParts["name"] = updatedParts["name"].toLowerCase().trim(); 
        }
        await Courses.update(updatedParts, {
            where: {
                id,
            }
        });

        const updatedCourse = await Courses.findByPk(id);
        return res.status(200).json({success: true, message: 'Course updated successfully', course: updatedCourse});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
});

// ADMIN PATH
// DELETE A COURSE
router.delete('/:id', isUserAuthenticated, isUserAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Invalid course id'});
        }
        const course = await Courses.findByPk(id);
        if (!course) {
            return res.status(404).json({success: false, message: 'Course not found'});
        }
        const deletedCourse = await Courses.destroy({
            where: {
                id,
            }
        });
        if (deletedCourse === 0) {
            return res.status(500).json({ success: false, message: 'Failed to delete course' });
        }
        return res.status(200).json({success: true, message: `${course.name[0].toUpperCase()}${course.name.substring(1)} course was deleted successfully`});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

module.exports = router;