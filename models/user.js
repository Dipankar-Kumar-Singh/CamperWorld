const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email : {
        type : String , 
        required : true ,
        unique : true 
    }
});

// very very Important to use .. for Autthentication
User.plugin(passportLocalMongoose);
module.exports.User = mongoose.model('User', User);