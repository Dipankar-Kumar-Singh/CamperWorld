const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require('./cities');
const { places , descriptors } = require('./seedHelpers');

const MY_ACCESS_TOKEN = 'pk.eyJ1IjoidGVhLWRldiIsImEiOiJjbGV4b2VxcmsybHl4M3VydjY3NWNhMjl3In0.fNaTP9mskssQg4uEbTBpYw';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' );
mongoose.set('strictQuery', false);

const db = mongoose.connection ;
db.on('error' , console.error.bind(console, "connection error : ")) ;
db.once('open' , () => {
    console.log("Database Conncected") ;
})  ;


const sample = array => array[Math.floor(Math.random() * array.length)] ;


const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: "Purple Field" }) ;
    // await c.save();

    for(let i = 0 ; i < 50 ; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const LOCATION = `${cities[random1000].city}, ${cities[random1000].state}` ;

        const geoData = await geoCoder.forwardGeocode({
            query: LOCATION ,
            limit: 1
        }).send();
        
        const camp = new Campground({
            location: LOCATION ,
            title: `${sample(descriptors)}  ${sample(places)}`,
            image: `https://source.unsplash.com/collection/483251?sig=${random1000}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam ad molestias recusandae iure accusamus, inventore repellendus voluptate non ullam. Nihil iure repudiandae modi harum quos corrupti sapiente ea ullam itaque.",
            price: Math.floor(Math.random() * 20) + 10
        });

        camp.geometry = geoData.body.features[0].geometry;

        await camp.save() ;
        // setTimeout(() => {}, 500);   
    }
};

seedDB().then(() =>{
    mongoose.connection.close() ;
}) ;


