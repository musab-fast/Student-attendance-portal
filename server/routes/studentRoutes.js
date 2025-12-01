const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');

router.get('/attendance', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const attendance = await Attendance.find({ student_id: student._id }).populate('course_id', 'course_name');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/results', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const results = await Result.find({ student_id: student._id }).populate('course_id', 'course_name');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/fees', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const fees = await Fee.find({ student_id: student._id });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/timetable', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        // Get timetable for all enrolled courses
        const timetable = await Timetable.find({
            course: { $in: student.enrolled_courses },
            semester: student.semester
        })
            .populate('course', 'course_name course_id credit_hours')
            .populate({
                path: 'teacher',
                populate: { path: 'user_id', select: 'name' }
            })
            .sort({ day: 1, startTime: 1 });

        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/profile', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id })
            .populate('user_id', 'name email role')
            .populate('enrolled_courses', 'course_name course_id credit_hours');

        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/profile', protect, authorize('student'), async (req, res) => {
    try {
        const { phone, address, date_of_birth, guardian_name, guardian_phone, blood_group, profile_picture } = req.body;

        const student = await Student.findOneAndUpdate(
            { user_id: req.user._id },
            { phone, address, date_of_birth, guardian_name, guardian_phone, blood_group, profile_picture },
            { new: true }
        )
            .populate('user_id', 'name email role')
            .populate('enrolled_courses', 'course_name course_id credit_hours');

        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/leave-request', protect, authorize('student'), async (req, res) => {
    try {
        const LeaveRequest = require('../models/LeaveRequest');
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const { start_date, end_date, reason } = req.body;

        const leaveRequest = await LeaveRequest.create({
            student_id: student._id,
            start_date,
            end_date,
            reason
        });

        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/leave-requests', protect, authorize('student'), async (req, res) => {
    try {
        const LeaveRequest = require('../models/LeaveRequest');
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const leaveRequests = await LeaveRequest.find({ student_id: student._id })
            .populate('reviewed_by', 'name')
            .sort({ createdAt: -1 });

        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/analytics', protect, authorize('student'), async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        // Get attendance by course
        const attendanceRecords = await Attendance.find({ student_id: student._id })
            .populate('course_id', 'course_name');

        const attendanceByCourse = {};
        attendanceRecords.forEach(record => {
            const courseName = record.course_id?.course_name || 'Unknown';
            if (!attendanceByCourse[courseName]) {
                attendanceByCourse[courseName] = { total: 0, present: 0 };
            }
            attendanceByCourse[courseName].total++;
            if (record.status === 'Present') {
                attendanceByCourse[courseName].present++;
            }
        });

        // Calculate percentages
        const attendanceStats = Object.keys(attendanceByCourse).map(course => ({
            course,
            percentage: attendanceByCourse[course].total > 0
                ? ((attendanceByCourse[course].present / attendanceByCourse[course].total) * 100).toFixed(2)
                : 0,
            present: attendanceByCourse[course].present,
            total: attendanceByCourse[course].total
        }));

        // Get results/GPA
        const results = await Result.find({ student_id: student._id })
            .populate('course_id', 'course_name')
            .sort({ createdAt: 1 });

        const gpaHistory = results.map(r => ({
            course: r.course_id?.course_name,
            gpa: r.gpa,
            grade: r.grade,
            total: r.total
        }));

        res.json({
            attendanceStats,
            gpaHistory,
            overallGPA: results.length > 0
                ? (results.reduce((sum, r) => sum + r.gpa, 0) / results.length).toFixed(2)
                : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
