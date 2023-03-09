const mongoose = require('mongoose');
const Campground = require("../models/campground");

const DESCRIPTION_OF_LOCATION = `Welcome to our outdoor fun location! We are delighted to offer you a unique and exciting experience surrounded by nature. Our location boasts a variety of outdoor activities that are perfect for families, groups, and individuals looking for an adventure.
Explore our lush hiking trails and immerse yourself in the natural beauty of the surrounding landscape. Take in stunning views of the mountains, rivers, and forests as you hike through our well-marked trails. For thrill-seekers, we offer exciting zip-lining adventures that will have you soaring through the air and enjoying a bird's eye view of the area.
If you prefer water activities, we have plenty of options for you. Our crystal-clear lake is perfect for swimming, kayaking, paddleboarding, and fishing. You can also take a relaxing boat rde and soak in the tranquility of the water. For those looking for a bit more excitement, we offer jet skiing and water tubing.` ;

const { places, descriptors } = require('./seedHelpers');

const MY_ACCESS_TOKEN = 'pk.eyJ1IjoidGVhLWRldiIsImEiOiJjbGV4b2VxcmsybHl4M3VydjY3NWNhMjl3In0.fNaTP9mskssQg4uEbTBpYw';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { indianCitiesData } = require('./Data/indianCities');
const cities = indianCitiesData;
const geoCoder = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.set('strictQuery', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error : "));
db.once('open', () => {
    console.log("Database Conncected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    // await Campground.deleteMany({});
    // const c = new Campground({ title: "Purple Field" }) ;
    // await c.save();

    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const LOCATION = `${cities[random1000].name}, ${cities[random1000].state}`;

        const geoData = await geoCoder.forwardGeocode({
            query: LOCATION,
            limit: 1
        }).send();

        const camp = new Campground({
            location: LOCATION,
            title: `${sample(descriptors)}  ${sample(places)}`,
            image: `https://source.unsplash.com/collection/483251?sig=${random1000}`,
            description: DESCRIPTION_OF_LOCATION ,
            price: Math.floor(Math.random() * 20) + 10
        });

        camp.geometry = geoData.body.features[0].geometry;
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});


