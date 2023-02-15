const Joi = require("joi");
const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
    }).required()
});

module.exports.campgroundSchema = campgroundSchema ;