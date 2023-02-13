const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require('./cities');
const { places , descriptors } = require('./seedHelpers');

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
    const c = new Campground({ title: "Purple Field" }) ;
    await c.save();

    for(let i = 0 ; i < 50 ; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location : `${cities[random1000].city}, ${cities[random1000].state}` , 
            title : `${sample(descriptors)}  ${sample(places)}` 
        });
        await camp.save() ;
    }
};

seedDB().then(() =>{
    mongoose.connection.close() ;
}) ;