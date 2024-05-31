const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
          
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJlZSUyMHBpYyUyMHdpdGglMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D",
            set: (v) =>
                v === " " ? "https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJlZSUyMHBpYyUyMHdpdGglMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D" : v,
        }
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
