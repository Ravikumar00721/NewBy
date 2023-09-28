const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp')
    .then(() => {
        console.log("Sucess");
    })
    .catch((e) => {
        console.log("Error");
    })

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100) + 10;
        const camp = new Campground({
            author: '6505749c5828142c6c0258b7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic.Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.',
            price,
            geometry:{
                 type:'Point',
                 coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                 ]            
            },
            images: [

                {

                    url: 'https://res.cloudinary.com/doo34cgwh/image/upload/v1695032257/YelpCamp/uftmhnisr67cftpjihzd.png',
                    filename: 'YelpCamp/uftmhnisr67cftpjihzd'
                },
                {

                    url: 'https://res.cloudinary.com/doo34cgwh/image/upload/v1695032258/YelpCamp/bboyfxpua5pe78h7e8u7.png',
                    filename: 'YelpCamp/bboyfxpua5pe78h7e8u7'
                }

            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})