const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set('strictQuery', false);

const reviewSchema = new Schema({
    body : String , 
    rating  : Number 
});

module.exports = mongoose.model("Review" , reviewSchema) ;
