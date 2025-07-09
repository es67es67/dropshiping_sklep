const Review = require('../models/reviewModel');

exports.addReview = async (req, res) => {
  try {
    const { target, targetType, rating, comment } = req.body;
    const review = new Review({ author: req.userId, target, targetType, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ target: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
