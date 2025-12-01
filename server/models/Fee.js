const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    semester: { type: String, required: true },
    description: { type: String, required: true },
    due_date: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
