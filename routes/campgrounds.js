const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchasync');
const { islogged, isAuthor } = require('../middleware');
const { validatecmp } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(islogged,upload.array('image'),validatecmp,catchAsync(campgrounds.createnew))
    

router.get('/new', islogged, catchAsync(campgrounds.rendernewform));

router.get('/:id', catchAsync(campgrounds.show));
router.get('/:id/edit', islogged, isAuthor, catchAsync(campgrounds.edit));

router.route('/:id')
    .delete(islogged, isAuthor, catchAsync(campgrounds.delete))
    .put(islogged,upload.array('image'), validatecmp, catchAsync(campgrounds.update))

module.exports = router;