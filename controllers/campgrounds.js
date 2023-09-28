const {cloudinary}=require('../cloudinary');
const Campground = require('../models/campground');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken})

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}
module.exports.rendernewform=async (req, res) => {
    res.render('campgrounds/new');
}
module.exports.createnew=async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    // res.send('its ok');
    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('s', 'oh yeah');
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.show=async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}
module.exports.edit=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground });
}
module.exports.delete=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}
module.exports.update=async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(campground);
    }
    res.redirect(`/campgrounds/${campground._id}`)
}