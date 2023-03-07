const { default: mongoose } = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
mongoose.set('strictQuery', false);
const opts = { toJSON: { virtuals: true }  , toObject: { virtuals: true },};

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            // required : true 
        },
        coordinates: {
            type: [Number],
            // required : true 
        }
    },
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href = "/campgrounds/${this._id}"> ${this.title}  </a>` ;
});

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