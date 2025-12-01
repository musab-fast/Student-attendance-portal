const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Announcement = require('../models/Announcement');

// @route   GET /api/announcements
// @desc    Get active announcements for user role
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const currentDate = new Date();

        const announcements = await Announcement.find({
            $and: [
                {
                    $or: [
                        { target_audience: 'all' },
                        { target_audience: req.user.role }
                    ]
                },
                {
                    $or: [
                        { expiry_date: { $gte: currentDate } },
                        { expiry_date: null }
                    ]
                }
            ]
        })
            .populate('author_id', 'name')
            .sort({ priority: -1, createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
