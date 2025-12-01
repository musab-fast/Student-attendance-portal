const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Timetable = require('../models/Timetable');
const bcrypt = require('bcryptjs');


router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/users', protect, authorize('admin'), async (req, res) => {
    const { name, email, password, role, ...otherDetails } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        if (role === 'student') {
            await Student.create({
                user_id: user._id,
                ...otherDetails
            });
        } else if (role === 'teacher') {
            await Teacher.create({
                user_id: user._id,
                ...otherDetails
            });
        }

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            // Also delete associated student/teacher profile
            if (user.role === 'student') {
                await Student.findOneAndDelete({ user_id: user._id });
            } else if (user.role === 'teacher') {
                await Teacher.findOneAndDelete({ user_id: user._id });
            }
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/courses', protect, authorize('admin'), async (req, res) => {
    try {
        const course = await Course.create(req.body);

        // If instructor is assigned, update the Teacher's assigned_courses
        if (req.body.instructor_id) {
            // Find the Teacher document by user_id (instructor_id is actually the User ID)
            const teacher = await Teacher.findOne({ user_id: req.body.instructor_id });
            if (teacher) {
                // Add course to teacher's assigned_courses if not already there
                if (!teacher.assigned_courses.includes(course._id)) {
                    teacher.assigned_courses.push(course._id);
                    await teacher.save();
                }
            }
        }

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/courses', protect, authorize('admin'), async (req, res) => {
    try {
        const courses = await Course.find({}).populate('instructor_id', 'name');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/assign-course', protect, authorize('admin'), async (req, res) => {
    const { studentId, courseId } = req.body;

    try {
        // Find student by user_id (studentId is actually the User's _id from frontend)
        const student = await Student.findOne({ user_id: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already enrolled
        if (student.enrolled_courses.includes(courseId)) {
            return res.status(400).json({ message: 'Student already enrolled in this course' });
        }

        student.enrolled_courses.push(courseId);
        await student.save();

        res.json({ message: 'Course assigned successfully', student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/fees', protect, authorize('admin'), async (req, res) => {
    try {
        const { student_id, amount, semester, description, due_date } = req.body;

        // Find student by user_id
        const student = await Student.findOne({ user_id: student_id });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const fee = await Fee.create({
            student_id: student._id,
            amount,
            semester,
            description,
            due_date,
            status: 'Unpaid'
        });

        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/fees', protect, authorize('admin'), async (req, res) => {
    try {
        const fees = await Fee.find({})
            .populate({
                path: 'student_id',
                populate: { path: 'user_id', select: 'name email' }
            })
            .sort({ createdAt: -1 });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/fees/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate({
            path: 'student_id',
            populate: { path: 'user_id', select: 'name email' }
        });

        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }

        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/fees/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }
        res.json({ message: 'Fee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/reports/teachers', protect, authorize('admin'), async (req, res) => {
    try {
        const teachers = await Teacher.find({})
            .populate('user_id', 'name email')
            .populate('assigned_courses', 'course_name course_id');

        const teacherReports = await Promise.all(teachers.map(async (teacher) => {
            // Count students across all assigned courses
            let totalStudents = 0;
            for (const course of teacher.assigned_courses) {
                const students = await Student.find({ enrolled_courses: course._id });
                totalStudents += students.length;
            }

            return {
                _id: teacher._id,
                name: teacher.user_id?.name,
                email: teacher.user_id?.email,
                teacher_id: teacher.teacher_id,
                department: teacher.department,
                courses: teacher.assigned_courses.length,
                students: totalStudents,
                courseDetails: teacher.assigned_courses
            };
        }));

        res.json(teacherReports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/reports/students', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await Student.find({})
            .populate('user_id', 'name email')
            .populate('enrolled_courses', 'course_name course_id');

        const studentReports = await Promise.all(students.map(async (student) => {
            // Get attendance statistics
            const attendanceRecords = await Attendance.find({ student_id: student._id });
            const totalAttendance = attendanceRecords.length;
            const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
            const attendancePercentage = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(2) : 0;

            // Get results
            const results = await Result.find({ student_id: student._id }).populate('course_id', 'course_name');

            // Get fees
            const fees = await Fee.find({ student_id: student._id });
            const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
            const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
            const unpaidFees = totalFees - paidFees;

            return {
                _id: student._id,
                name: student.user_id?.name,
                email: student.user_id?.email,
                student_id: student.student_id,
                roll_number: student.roll_number,
                department: student.department,
                semester: student.semester,
                section: student.section,
                enrolledCourses: student.enrolled_courses.length,
                attendancePercentage,
                totalAttendance,
                presentCount,
                resultsCount: results.length,
                totalFees,
                paidFees,
                unpaidFees,
                feeStatus: unpaidFees > 0 ? 'Pending' : 'Clear'
            };
        }));

        res.json(studentReports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/timetable', protect, authorize('admin'), async (req, res) => {
    try {
        const { course_id, teacher_id, day, startTime, endTime, room, semester } = req.body;

        // Find teacher by user_id
        const teacher = await Teacher.findOne({ user_id: teacher_id });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const timetable = await Timetable.create({
            course: course_id,
            teacher: teacher._id,
            day,
            startTime,
            endTime,
            room,
            semester
        });

        res.status(201).json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/timetable', protect, authorize('admin'), async (req, res) => {
    try {
        const timetable = await Timetable.find({})
            .populate('course', 'course_name course_id')
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


router.put('/timetable/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { course_id, teacher_id, day, startTime, endTime, room, semester } = req.body;

        let updateData = { day, startTime, endTime, room, semester };

        if (teacher_id) {
            const teacher = await Teacher.findOne({ user_id: teacher_id });
            if (teacher) {
                updateData.teacher = teacher._id;
            }
        }

        if (course_id) {
            updateData.course = course_id;
        }

        const timetable = await Timetable.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
            .populate('course', 'course_name course_id')
            .populate({
                path: 'teacher',
                populate: { path: 'user_id', select: 'name' }
            });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }

        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/timetable/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndDelete(req.params.id);
        if (!timetable) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }
        res.json({ message: 'Timetable entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== ANNOUNCEMENT MANAGEMENT ====================

// @route   POST /api/admin/announcements
// @desc    Create announcement
// @access  Private/Admin
router.post('/announcements', protect, authorize('admin'), async (req, res) => {
    try {
        const Announcement = require('../models/Announcement');
        const { title, content, target_audience, priority, expiry_date } = req.body;

        const announcement = await Announcement.create({
            title,
            content,
            author_id: req.user._id,
            target_audience,
            priority,
            expiry_date
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/announcements
// @desc    Get all announcements
// @access  Private/Admin
router.get('/announcements', protect, authorize('admin'), async (req, res) => {
    try {
        const Announcement = require('../models/Announcement');
        const announcements = await Announcement.find({})
            .populate('author_id', 'name email')
            .sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/announcements/:id
// @desc    Update announcement
// @access  Private/Admin
router.put('/announcements/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const Announcement = require('../models/Announcement');
        const { title, content, target_audience, priority, expiry_date } = req.body;

        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, content, target_audience, priority, expiry_date },
            { new: true }
        ).populate('author_id', 'name email');

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/admin/announcements/:id
// @desc    Delete announcement
// @access  Private/Admin
router.delete('/announcements/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const Announcement = require('../models/Announcement');
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== LEAVE REQUEST MANAGEMENT ====================

// @route   GET /api/admin/leave-requests
// @desc    Get all leave requests
// @access  Private/Admin
router.get('/leave-requests', protect, authorize('admin'), async (req, res) => {
    try {
        const LeaveRequest = require('../models/LeaveRequest');
        const status = req.query.status; // Filter by status if provided

        const query = status ? { status } : {};

        const leaveRequests = await LeaveRequest.find(query)
            .populate({
                path: 'student_id',
                populate: { path: 'user_id', select: 'name email' }
            })
            .populate('reviewed_by', 'name')
            .sort({ createdAt: -1 });

        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/leave-requests/:id
// @desc    Approve/reject leave request
// @access  Private/Admin
router.put('/leave-requests/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const LeaveRequest = require('../models/LeaveRequest');
        const { status, admin_remarks } = req.body;

        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            req.params.id,
            {
                status,
                admin_remarks,
                reviewed_by: req.user._id,
                review_date: new Date()
            },
            { new: true }
        )
            .populate({
                path: 'student_id',
                populate: { path: 'user_id', select: 'name email' }
            })
            .populate('reviewed_by', 'name');

        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Create notification for student
        const Notification = require('../models/Notification');
        const studentUserId = leaveRequest.student_id.user_id._id;

        await Notification.create({
            user_id: studentUserId,
            title: `Leave Request ${status}`,
            message: `Your leave request from ${new Date(leaveRequest.start_date).toLocaleDateString()} to ${new Date(leaveRequest.end_date).toLocaleDateString()} has been ${status}.`,
            type: status === 'approved' ? 'success' : 'warning',
            link: '/student/leave-requests'
        });

        res.json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== ANALYTICS ====================

// @route   GET /api/admin/analytics/attendance
// @desc    Get attendance analytics
// @access  Private/Admin
router.get('/analytics/attendance', protect, authorize('admin'), async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({})
            .populate('course_id', 'course_name');

        // Group by course
        const attendanceByCourse = {};
        attendanceRecords.forEach(record => {
            const courseName = record.course_id?.course_name || 'Unknown';
            if (!attendanceByCourse[courseName]) {
                attendanceByCourse[courseName] = { total: 0, present: 0, absent: 0 };
            }
            attendanceByCourse[courseName].total++;
            if (record.status === 'Present') {
                attendanceByCourse[courseName].present++;
            } else {
                attendanceByCourse[courseName].absent++;
            }
        });

        const attendanceStats = Object.keys(attendanceByCourse).map(course => ({
            course,
            total: attendanceByCourse[course].total,
            present: attendanceByCourse[course].present,
            absent: attendanceByCourse[course].absent,
            percentage: attendanceByCourse[course].total > 0
                ? ((attendanceByCourse[course].present / attendanceByCourse[course].total) * 100).toFixed(2)
                : 0
        }));

        res.json(attendanceStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/analytics/performance
// @desc    Get performance analytics
// @access  Private/Admin
router.get('/analytics/performance', protect, authorize('admin'), async (req, res) => {
    try {
        const results = await Result.find({}).populate('course_id', 'course_name');

        // Grade distribution
        const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        results.forEach(result => {
            if (gradeDistribution.hasOwnProperty(result.grade)) {
                gradeDistribution[result.grade]++;
            }
        });

        // Average GPA
        const avgGPA = results.length > 0
            ? (results.reduce((sum, r) => sum + r.gpa, 0) / results.length).toFixed(2)
            : 0;

        // Performance by course
        const performanceByCourse = {};
        results.forEach(result => {
            const courseName = result.course_id?.course_name || 'Unknown';
            if (!performanceByCourse[courseName]) {
                performanceByCourse[courseName] = { totalGPA: 0, count: 0 };
            }
            performanceByCourse[courseName].totalGPA += result.gpa;
            performanceByCourse[courseName].count++;
        });

        const coursePerformance = Object.keys(performanceByCourse).map(course => ({
            course,
            averageGPA: (performanceByCourse[course].totalGPA / performanceByCourse[course].count).toFixed(2),
            studentCount: performanceByCourse[course].count
        }));

        res.json({
            gradeDistribution,
            avgGPA,
            coursePerformance,
            totalResults: results.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/analytics/fees
// @desc    Get fee collection analytics
// @access  Private/Admin
router.get('/analytics/fees', protect, authorize('admin'), async (req, res) => {
    try {
        const fees = await Fee.find({});

        const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
        const unpaidFees = totalFees - paidFees;
        const collectionRate = totalFees > 0 ? ((paidFees / totalFees) * 100).toFixed(2) : 0;

        // Monthly collection (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentFees = fees.filter(f => new Date(f.createdAt) >= sixMonthsAgo);
        const monthlyCollection = {};

        recentFees.forEach(fee => {
            const month = new Date(fee.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!monthlyCollection[month]) {
                monthlyCollection[month] = { total: 0, paid: 0 };
            }
            monthlyCollection[month].total += fee.amount;
            if (fee.status === 'Paid') {
                monthlyCollection[month].paid += fee.amount;
            }
        });

        res.json({
            totalFees,
            paidFees,
            unpaidFees,
            collectionRate,
            monthlyCollection,
            totalRecords: fees.length,
            paidRecords: fees.filter(f => f.status === 'Paid').length,
            unpaidRecords: fees.filter(f => f.status === 'Unpaid').length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
