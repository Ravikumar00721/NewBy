const { reviewSchema } = require("./schema.js");
const ExpressError = require('./utils/expressError');
const Campground = require('./models/campground');
const { campGroundSchema} = require("./schema.js");

const islogged=(req,res,next)=>{
    console.log("Req ...",req.user);
    if(!req.isAuthenticated())
    {
        req.session.returnTo=req.originalUrl;
        req.flash('error','You first must signed in');
        return res.redirect('/login');
    }
    next();
}
module.exports.islogged=islogged;

const validatecmp = (req, res, next) => {
    const { error } = campGroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}
module.exports.validatecmp =validatecmp;

const isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error','You do not have permission have to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isAuthor=isAuthor;

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}
module.exports.validateReview=validateReview;