const mongoose = require('mongoose');
const Campground = require("../models/campground");
// const cities = require('./cities');

const DESCRIPTION_OF_LOCATION = `Welcome to our outdoor fun location! We are delighted to offer you a unique and exciting experience surrounded by nature. Our location boasts a variety of outdoor activities that are perfect for families, groups, and individuals looking for an adventure.
Explore our lush hiking trails and immerse yourself in the natural beauty of the surrounding landscape. Take in stunning views of the mountains, rivers, and forests as you hike through our well-marked trails. For thrill-seekers, we offer exciting zip-lining adventures that will have you soaring through the air and enjoying a bird's eye view of the area.
If you prefer water activities, we have plenty of options for you. Our crystal-clear lake is perfect for swimming, kayaking, paddleboarding, and fishing. You can also take a relaxing boat rde and soak in the tranquility of the water. For those looking for a bit more excitement, we offer jet skiing and water tubing.` ;

const { places, descriptors } = require('./seedHelpers');


const MY_ACCESS_TOKEN = 'pk.eyJ1IjoidGVhLWRldiIsImEiOiJjbGV4b2VxcmsybHl4M3VydjY3NWNhMjl3In0.fNaTP9mskssQg4uEbTBpYw';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

const { citiesData } = require('./Data/famousWorldCities');
const { array } = require('joi');
// const { chinaCity } = require('./Data/chinaCities');
// const cities = citiesData;
// const geoCoder = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

const MONGODB___URL = 'mongodb://127.0.0.1:27017/yelp-camp' ;

mongoose.connect(MONGODB___URL);
mongoose.set('strictQuery', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error : "));
db.once('open', () => {
    console.log("Database Conncected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


async function saveData(element) {
    const random1000 = Math.floor(Math.random() * 1000);
    const LOC = element.name ;
    const COORDINATES = [  Number(element.latitude) , Number(element.longitude),];
    const geometryOBJ = { type: 'Point', coordinates: COORDINATES };
    const camp = new Campground({
        location: LOC ,
        title: `${sample(descriptors)}  ${sample(places)}`,
        image: `https://source.unsplash.com/collection/483251?sig=${random1000}`,
        description: DESCRIPTION_OF_LOCATION ,
        price: Math.floor(Math.random() * 100000) + 10
    });
    camp.geometry = geometryOBJ ;
    console.log(camp.geometry) ;    
    await camp.save();
}
const seedDB = async () => {
    citiesData.forEach(saveData);
    // chinaCity.forEach(saveDataBYGEOLOC_MAPBOX);
};

seedDB().then(() => {
    // mongoose.connection.close();
});


