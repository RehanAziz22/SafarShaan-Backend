const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
  plateNo: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: true
    }
  },
  markerVisible:{
    type:Boolean,
    default:true,
    required:true
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'under_maintenance', 'reserved'],
    default: 'available',
    required: true
  },
  fuelLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 100 // Assuming percentage for electric bikes
  },
  lastMaintenanceDate: {
    type: Date,
    default: new Date()
  },
  additionalInfo: {
    type: Object
  },
  rentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCosts: {
    type: Number,
    default: 0,
    min: 0
  },
  ratePerMin: {
    type: Number,
    default: 0,
    min: 0,
  },
  ratePerKm: {
    type: Number,
    min: 0,
    default: 0,
  },
  fuel: {
    type: String,
    default: 'Petrol'
  },
  fuelConsumption: [{
    timestamp: Date,
    // default: new Date(),
    fuelLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  fuelEfficiency: {
    type: Number, // km/liter
    min: 0,
    default: 0,
  },
  rideHistory: [{
    startTime: Date,
    endTime: Date,
    // default: new Date(),
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
    }
  }]
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
