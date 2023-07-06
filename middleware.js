const { eventSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError.js');
const Event = require('./models/event')
const { reviewSchema } = require('./schema.js')
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {

    console.log("REQ USER:", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first')
        return res.redirect('/login')
    }
    next();

}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const event = await Event.findById(id)
    if (!event.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission for that!');
        return res.redirect(`/events/${id}`);
    }
    next();
}

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission for that!');
        return res.redirect(`/events/${id}`);
    }
    next();
}

