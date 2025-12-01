const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    read: { type: Boolean, default: false },
    link: { type: String }, // Optional link to related page
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
