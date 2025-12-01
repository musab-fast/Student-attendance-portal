const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    parent_message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // For threading
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
