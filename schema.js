//validation

const Joi = require('joi');
const ExpressError = require('./utils/expressError.js');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(500),
        country: Joi.string().required(),
        location: Joi.string().required(),
        image: {
            url: Joi.string().allow("", null)
        }
    }).required()
});

function validateListing(req, res, next) {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message.replace('listing.', '')).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}


const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().default(5),
    }).required()
});

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message.replace('.comment', '')).join(', ');
        req.flash('error', msg.replace('review.', ' '));
        return res.redirect('/listings');
    }
    next();
}

module.exports = { validateListing, validateReview };