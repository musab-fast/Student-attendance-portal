const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student_id: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    roll_number: { type: String, required: true },
    enrolled_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    // Profile fields
    phone: { type: String },
    address: { type: String },
    date_of_birth: { type: Date },
    guardian_name: { type: String },
    guardian_phone: { type: String },
    blood_group: { type: String },
    profile_picture: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
