const express = require('express');
const router =  express.Router();
const { Courses, Enrollments } = require('../models');
const isUserAuthenticated = require('../helpers/isUserAuthenticated');

router.post('/:courseId', isUserAuthenticated, async (req, res) =>{
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
            return res.status(200).json({success: false, message: 'You are already registered in this course'});
        }
        const newEnrollment = await Enrollments.createAndReturn({
            courseId,
            studentId: req.user.id,
        });
        
        return res.status(200).json({success: true, newEnrollment, message: 'Successfully registered'});
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Interval server error'});
    }
});

router.delete('/:enrollmentId', isUserAuthenticated, async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        if (isNaN(enrollmentId)) {
            return res.status(400).json({success: false, message: 'Invalid enrollment id'});
        }
        const enrollment = await Enrollments.findByPk(enrollmentId);
        if (!enrollment || enrollment.studentId === req.user.id) {
            return res.status(404).json({success: false, message: 'Enrollment not found!'});
        } 
        const deleteCount = await Enrollments.destroy({
            where: {
                id: enrollmentId,
            }
        });
        if (deleteCount === 0) {
            return res.status(500).json({success: false, message: 'Deletion failed'});
        }
        return res.status(200).json({success: true, message: 'Deletion successfully made!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
});

module.exports =  router; 