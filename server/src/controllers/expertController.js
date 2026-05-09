const Expert = require('../models/Expert');

// ─── GET /api/experts ─────────────────────────────────────────────────────────
// Supports: ?page=1&limit=10&category=Technology
const getExperts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) {
      // Case-insensitive category matching
      filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    const [experts, total] = await Promise.all([
      Expert.find(filter).skip(skip).limit(limit).sort({ rating: -1 }),
      Expert.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: experts,
      pagination: {
        currentPage: page,
        totalPages,
        totalExperts: total,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/experts/:id ─────────────────────────────────────────────────────
const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }
    res.status(200).json({ success: true, data: expert });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/experts ────────────────────────────────────────────────────────
const createExpert = async (req, res, next) => {
  try {
    const { name, category, experience, rating } = req.body;
    const expert = await Expert.create({ name, category, experience, rating });
    res.status(201).json({ success: true, data: expert });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperts, getExpertById, createExpert };
