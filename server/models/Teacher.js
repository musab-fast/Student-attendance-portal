const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher_id: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    assigned_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    // Profile fields
    phone: { type: String },
    address: { type: String },
    date_of_birth: { type: Date },
    qualification: { type: String },
    specialization: { type: String },
    profile_picture: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
