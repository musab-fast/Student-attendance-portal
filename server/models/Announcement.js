const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target_audience: { type: String, enum: ['all', 'students', 'teachers'], default: 'all' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    expiry_date: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
