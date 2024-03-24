const mongoose = require("mongoose");

const bikeSchema = mongoose.Schema({
    model: String, // The model of the bike
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'], // Bike status to manage availability
        default: 'available'
    },
    location: {
        lat: Number, // Latitude for current bike location
        lng: Number  // Longitude for current bike location
    },
    lastServicedOn: Date, // Last service date for maintenance tracking
    ratePerHour: Number, // Rental rate per hour
    features: [String], // Array of features like ['gear', 'electric', 'basket']
    isElectric: {
        type: Boolean,
        default: false
    }, // Whether the bike is electric
    fuel: {
        type: Number,
        min: 0,
        max: 100,
        required: function() { return !this.isElectric; } // Required if not electric
    } // Fuel level percentage (0-100), not required for electric bikes
});

const bikeModel = mongoose.model("Bike", bikeSchema);

module.exports = bikeModel;
