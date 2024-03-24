const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define a GeoSchema for GeoJSON Point
const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere" // Create a geospatial index
  }
});

const bikeSchema = new mongoose.Schema({
  bikeId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: "Unique identifier assigned to the bike by the company"
  },
  model: {
    type: String,
    description: "Model name of the bike (e.g., City Bike, Mountain Bike)"
  },
  location: GeoSchema,
  status: {
    type: String,
    enum: ["available", "in_use", "under_maintenance", "reserved"],
    // required: true,
    default: "available",
    // index: true, // Index for frequent status-based queries
    description: "Current status of the bike"
  },
  fuelLevel: {
    type: Number,
    description: "Fuel level of the bike (in liters for gas bikes, percentage for electric bikes)"
  },
  lastMaintenanceDate: {
    type: Date,
    description: "Date of the bike's last maintenance"
  },
  additionalInfo: {
    type: Object,
    description: "Optional field for any additional information about the bike (e.g., lock code, image URL)"
  },
  rentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    description: "User who has currently rented the bike (if applicable)"
  }
});


module.exports = mongoose.model("bike", bikeSchema);
