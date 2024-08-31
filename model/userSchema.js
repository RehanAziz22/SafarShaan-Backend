const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        // unique: true,
        // default:"@gmail.com"
        // sparse: true // Allows multiple `null` values
    },
    pin: {
        type: String,
        // required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    category: {
        type: String,
        // enum: ['regular', 'premium'],
        default: 'user'
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            // required: true
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
            // required: true
        }
    },
    accountBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    plateNo: {
        type: String,
        // required: true,
        // unique: true,
        // default: null
    },
    rideHistory: [{
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        pickUpAddress: {
            type: String,
            required: true
        },
        destinationAddress: {
            type: String,
            required: true
        },
        distance: {
            type: Number,
            default: 0,
            min: 0
        },
        duration: {
            type: Number,
            default: 0,
            min: 0
        },
        price: {
            type: Number,
            default: 0,
            min: 0
        },
        bike_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bike',
            default: null,
        },
        plateNo: {
            type: String,
            required: true,
            default: null
        },
        pickUpCoordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
            required: true
          },
          destinationCoordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
            required: true
          },
    }]
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
