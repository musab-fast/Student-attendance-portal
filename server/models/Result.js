const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    // Individual scores
    quiz1: { type: Number, default: 0 },
    quiz2: { type: Number, default: 0 },
    assignment1: { type: Number, default: 0 },
    assignment2: { type: Number, default: 0 },
    midterm: { type: Number, default: 0 },
    final_exam: { type: Number, default: 0 },
    // Calculated totals
    quiz: { type: Number, default: 0 },        // quiz1 + quiz2
    assignment: { type: Number, default: 0 },  // assignment1 + assignment2
    total: { type: Number, default: 0 },
    grade: { type: String },
    gpa: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
