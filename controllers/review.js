
const Campground = require('../models/campground');
const Review = require("../models/review");

module.exports.create=async (req, res) => {
    
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('s','new review was created');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.delete=async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`);
}