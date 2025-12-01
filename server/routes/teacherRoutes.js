const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');

router.post('/attendance', protect, authorize('teacher'), async (req, res) => {
    try {
        const { student_id, course_id, date, status } = req.body;

        // Check if attendance already marked for this date/student/course
        const existingAttendance = await Attendance.findOne({
            student_id,
            course_id,
            date
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this student on this date' });
        }

        const attendance = await Attendance.create({
            student_id,
            course_id,
            date,
            status
        });
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/results', protect, authorize('teacher'), async (req, res) => {
    try {
        const { student_id, course_id, quiz1, quiz2, assignment1, assignment2, midterm, final_exam } = req.body;

        // Calculate component totals
        const quizTotal = (quiz1 || 0) + (quiz2 || 0);           // Out of 20
        const assignmentTotal = (assignment1 || 0) + (assignment2 || 0);  // Out of 20
        const midtermScore = midterm || 0;                        // Out of 30
        const finalScore = final_exam || 0;                       // Out of 40

        // Calculate overall total (out of 100)
        const total = quizTotal + assignmentTotal + midtermScore + finalScore;

        let grade = 'F';
        let gpa = 0.0;

        if (total >= 90) { grade = 'A'; gpa = 4.0; }
        else if (total >= 80) { grade = 'B'; gpa = 3.0; }
        else if (total >= 70) { grade = 'C'; gpa = 2.0; }
        else if (total >= 60) { grade = 'D'; gpa = 1.0; }

        let result = await Result.findOne({ student_id, course_id });

        if (result) {
            // Update individual scores if provided
            if (quiz1 !== undefined) result.quiz1 = quiz1;
            if (quiz2 !== undefined) result.quiz2 = quiz2;
            if (assignment1 !== undefined) result.assignment1 = assignment1;
            if (assignment2 !== undefined) result.assignment2 = assignment2;
            if (midterm !== undefined) result.midterm = midterm;
            if (final_exam !== undefined) result.final_exam = final_exam;

            // Update calculated totals
            result.quiz = (result.quiz1 || 0) + (result.quiz2 || 0);
            result.assignment = (result.assignment1 || 0) + (result.assignment2 || 0);
            result.total = result.quiz + result.assignment + (result.midterm || 0) + (result.final_exam || 0);

            // Recalculate grade and GPA based on new total
            if (result.total >= 90) { result.grade = 'A'; result.gpa = 4.0; }
            else if (result.total >= 80) { result.grade = 'B'; result.gpa = 3.0; }
            else if (result.total >= 70) { result.grade = 'C'; result.gpa = 2.0; }
            else if (result.total >= 60) { result.grade = 'D'; result.gpa = 1.0; }
            else { result.grade = 'F'; result.gpa = 0.0; }

            await result.save();
        } else {
            result = await Result.create({
                student_id,
                course_id,
                quiz1: quiz1 || 0,
                quiz2: quiz2 || 0,
                assignment1: assignment1 || 0,
                assignment2: assignment2 || 0,
                midterm: midterm || 0,
                final_exam: final_exam || 0,
                quiz: quizTotal,
                assignment: assignmentTotal,
                total,
                grade,
                gpa
            });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/teacher/courses
// @desc    Get assigned courses
// @access  Private/Teacher
router.get('/courses', protect, authorize('teacher'), async (req, res) => {
    try {
        // Assuming the teacher's user ID is linked to the Teacher model
        const teacher = await require('../models/Teacher').findOne({ user_id: req.user._id });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        const courses = await Course.find({ _id: { $in: teacher.assigned_courses } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/enrolled-students/:courseId', protect, authorize('teacher'), async (req, res) => {
    try {
        const students = await Student.find({ enrolled_courses: req.params.courseId })
            .populate('user_id', 'name email'); // Get user details
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/timetable', protect, authorize('teacher'), async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user_id: req.user._id });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        const timetable = await Timetable.find({ teacher: teacher._id })
            .populate('course', 'course_name course_id credit_hours')
            .sort({ day: 1, startTime: 1 });

        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/teacher/profile
// @desc    Get teacher profile
// @access  Private/Teacher
router.get('/profile', protect, authorize('teacher'), async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user_id: req.user._id })
            .populate('user_id', 'name email role')
            .populate('assigned_courses', 'course_name course_id credit_hours');

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/teacher/profile
// @desc    Update teacher profile
// @access  Private/Teacher
router.put('/profile', protect, authorize('teacher'), async (req, res) => {
    try {
        const { phone, address, date_of_birth, qualification, specialization, profile_picture } = req.body;

        const teacher = await Teacher.findOneAndUpdate(
            { user_id: req.user._id },
            { phone, address, date_of_birth, qualification, specialization, profile_picture },
            { new: true }
        )
            .populate('user_id', 'name email role')
            .populate('assigned_courses', 'course_name course_id credit_hours');

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
