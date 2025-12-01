const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
