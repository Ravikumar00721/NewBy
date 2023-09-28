const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchasync');

const reviews=require('../controllers/review');
const {validateReview,islogged} = require('../middleware');


router.post('/', islogged,validateReview, catchAsync(reviews.create));
router.delete('/:reviewID', catchAsync(reviews.delete));

module.exports=router;