const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { receiver_id, subject, content, parent_message_id } = req.body;

        const message = await Message.create({
            sender_id: req.user._id,
            receiver_id,
            subject,
            content,
            parent_message_id
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender_id', 'name email role')
            .populate('receiver_id', 'name email role');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/messages/inbox
// @desc    Get received messages
// @access  Private
router.get('/inbox', protect, async (req, res) => {
    try {
        const messages = await Message.find({ receiver_id: req.user._id })
            .populate('sender_id', 'name email role')
            .populate('receiver_id', 'name email role')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/messages/sent
// @desc    Get sent messages
// @access  Private
router.get('/sent', protect, async (req, res) => {
    try {
        const messages = await Message.find({ sender_id: req.user._id })
            .populate('sender_id', 'name email role')
            .populate('receiver_id', 'name email role')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/messages/:id
// @desc    Get message details
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findOne({
            _id: req.params.id,
            $or: [
                { sender_id: req.user._id },
                { receiver_id: req.user._id }
            ]
        })
            .populate('sender_id', 'name email role')
            .populate('receiver_id', 'name email role')
            .populate('parent_message_id');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findOneAndUpdate(
            { _id: req.params.id, receiver_id: req.user._id },
            { read: true },
            { new: true }
        )
            .populate('sender_id', 'name email role')
            .populate('receiver_id', 'name email role');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const message = await Message.findOneAndDelete({
            _id: req.params.id,
            $or: [
                { sender_id: req.user._id },
                { receiver_id: req.user._id }
            ]
        });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/messages/users/search
// @desc    Search users to send message
// @access  Private
router.get('/users/search', protect, async (req, res) => {
    try {
        const searchQuery = req.query.q || '';

        const users = await User.find({
            _id: { $ne: req.user._id }, // Exclude current user
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        })
            .select('name email role')
            .limit(10);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
