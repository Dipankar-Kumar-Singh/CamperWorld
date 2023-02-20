const { default: mongoose } = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
mongoose.set('strictQuery', false);

const CampgroundSchema = new Schema({
    title: String,
    image : String , 
    price: Number,
    description: String,
    location: String ,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

// New thing to Learn ... After Deleting the Campground ... 
// we want to remove data [ reviews ] related to it .. 
// so using middleware .. findOneAndDele
// doc ---> Object that is been deleted .. 
CampgroundSchema.post('findOneAndDelete', async (doc) => {
    // console.log(doc) ;
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);