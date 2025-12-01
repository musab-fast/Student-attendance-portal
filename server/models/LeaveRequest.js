const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review_date: { type: Date },
    admin_remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
