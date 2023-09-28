// if(process.env.NODE_ENV!=='production')
// {
//     require('dotenv').config();
// }
require('dotenv').config();
console.log(process.env.api_secret);
console.log(process.env.api_key);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const ExpressError = require('./utils/expressError');


const helmet=require('helmet');
const session = require('express-session');
const MongoDBStore=require('connect-mongo')(session);
const routes = require('./routes/campgrounds');
const review = require('./routes/review');
const userRoute=require('./routes/user');
const flash = require('connect-flash');
const passport=require('passport');
const localS=require('passport-local');
const User=require('./models/user');
const sanitize=require('express-mongo-sanitize');
const dburl='mongodb://127.0.0.1:27017/yelp';
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Sucess");
    })
    .catch((e) => {
        console.log("Error");
    })
const store=new MongoDBStore({
    url:dburl,
    secret:'ravi',
    touchAfter:24*60*60
});
store.on('error',(e)=>{
    console.log('Nya error',e);
})
const app = express();
const s = ({
    store,
    name:'Ravi',
    secret: 'this',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
})

app.use(session(s));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localS(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentuser=req.user;
    res.locals.s = req.flash('s');
    res.locals.error = req.flash('error');
    next();
})


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(sanitize({
    replaceWith:'_'
}));
// app.use(helmet({contentSecurityPolicy:false}))
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doo34cgwh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/local',async(req,res)=>{
    const user=new User({email:'ss@gamil.com',username:'Ravi'});
    const newUser=await User.register(user,'example');
    res.send(newUser);
})

app.use(express.static('public'));
app.use('/',userRoute);
app.use('/campgrounds', routes);
app.use('/campgrounds/:id/reviews', review);
app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError(`Page not Found`, 404));
})
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    // res.status(status).send(message);  
    if (!err.message) err.message = "Something Went Wrong";
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})