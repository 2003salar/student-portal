const express = require('express');
const router =  express.Router();
const { Courses, Enrollments, Users } = require('../models');
const isUserAuthenticated = require('../helpers/isUserAuthenticated');
const isUserAdmin = require('../helpers/isUserAdmin');

// GET ALL ENROLLMENTS
router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const enrollments = await Enrollments.findAll({
            where: {
                studentId: req.user.id,
            }
        });
        return res.status(200).json({success: true, enrollments});
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
});

// Enroll in a course
router.post('/enroll/:courseId', isUserAuthenticated, async (req, res) =>{
    try {
        const { courseId } = req.params;
        if (isNaN(courseId)) {
            return res.status(400).json({success: false, message: 'Invalid course id'});
        }
        const course = await Courses.findByPk(courseId);
        if (!course) {
            return res.status(404).json({success: false, message: 'Course not found'});
        }
        const userAlreadyEnrolled = await Enrollments.findOne({
            where: {
                courseId,
                studentId: req.user.id,
            }
        });
        if (userAlreadyEnrolled) {
            return res.status(409).json({success: false, message: 'You are already registered in this course'});
        }
        const newEnrollment = await Enrollments.createAndReturn({
            courseId,
            studentId: req.user.id,
        });
        
        return res.status(200).json({success: true, newEnrollment, message: 'Successfully registered'});
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

// Delete an enrollment
router.delete('/unenroll/:enrollmentId', isUserAuthenticated, async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        if (isNaN(enrollmentId)) {
            return res.status(400).json({success: false, message: 'Invalid enrollment id'});
        }
        const enrollment = await Enrollments.findByPk(enrollmentId);
        if (!enrollment || enrollment.studentId !== req.user.id) {
            return res.status(404).json({success: false, message: 'Enrollment not found!'});
        } 
        const deleteCount = await Enrollments.destroy({
            where: {
                id: enrollmentId,
            }
        });
        if (deleteCount === 0) {
            return res.status(500).json({success: false, message: 'Internal server error'});
        }
        return res.status(200).json({success: true, message: 'Deletion successfully made!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
});

// Get all enrollments
router.get('/all-enrollments', isUserAuthenticated, isUserAdmin, async (req, res) => {
    try {
        const allEnrollments = await Enrollments.findAll({
            include: [
                {
                    model: Users,
                    as: 'student',
                    attributes: ['id', 'email', 'firstName', 'lastName']
                }
            ]
        });
        return res.status(200).json({success: true, allEnrollments});  
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
});

module.exports =  router; 