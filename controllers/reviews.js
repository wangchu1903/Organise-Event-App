const Review = require('../models/review');
const Event = require("../models/event");

module.exports.createReview = async (req, res) => {
    const event = await Event.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    event.reviews.push(review);
    await review.save();
    await event.save();
    req.flash('success', 'created new review!!')
    res.redirect(`/events/${event._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Event.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'sucessfully deleted')
    res.redirect(`/events/${id}`);
}