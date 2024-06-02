const Joi = require('joi');
module.exports.listingShema = Joi.object({
    listing : Joi.object({
    title : Joi.string().required(),
    description : Joi.string().required(),
    image : Joi.string().allow("", null),
    price : Joi.number().required().min(0), 
    country : Joi.string().required(),
    location : Joi.string().required(),
    }).required() 
});

