const { Router } = require('express');
const router = Router();

const BikeController = require('../controller/bikeController.js'); // Assuming BikeController is in ../controller/BikeController.js

// Route to get all bike details
router.get('/bikes', BikeController.getAllBikes);

// Adding a new bike
router.post("/bike", BikeController.addBike);

// Updating bike details
router.put("/bike/:id", BikeController.updateBikeDetails);

// Deleting a bike
router.delete("/bike/:id", BikeController.deleteBike);

// Fetching details of a single bike
router.get("/bike/:id", BikeController.getBikeDetails);

// Updating the status or location of a bike
router.patch("/bike/status-location/:id", BikeController.updateBikeStatusOrLocation);

module.exports = router;
