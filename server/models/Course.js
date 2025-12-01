const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_id: { type: String, required: true, unique: true },
    course_name: { type: String, required: true },
    credit_hours: { type: Number, required: true },
    semester: { type: String, required: true },
    instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
