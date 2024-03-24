const mongoose = require("mongoose");

const bikeModel = require("../model/bikeSchema.js");

const BikeController = {
    // Controller function to get all bike details
  getAllBikes: async (req, res) => {
    try {
      // Retrieve all bikes from the database
      const bikes = await bikeModel.find();

      // Check if there are no bikes found
      if (!bikes || bikes.length === 0) {
        return res.status(404).json({ message: 'No bikes found' });
      }

      // Return the array of bikes
      res.status(200).json(bikes);
    } catch (error) {
      console.error(error);
      // Return an error response if something goes wrong
      res.status(500).json({ message: 'Internal server error' });
    }
  },
    addBike: async (request, response) => {
        try {
            const { model, status, location, lastServicedOn, ratePerHour, features, isElectric, fuel,bikeId } = request.body;

            // Basic validation could be added here as needed
            const newBike = await bikeModel.create({
                bikeId,
                model,
                status,
                location,
                lastServicedOn,
                ratePerHour,
                features,
                isElectric,
                fuel
            });

            return response.status(200).json({
                message: 'Bike added successfully',
                data: newBike,
                success: true,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    },

    updateBikeDetails: async (request, response) => {
        try {
            const { id } = request.params; // assuming the bike ID is sent as a URL parameter
            const updateData = request.body;

            const updatedBike = await bikeModel.findByIdAndUpdate(id, updateData, { new: true });

            if (!updatedBike) {
                return response.status(404).json({
                    message: 'Bike not found',
                    success: false,
                });
            }

            return response.status(200).json({
                message: 'Bike details updated successfully',
                data: updatedBike,
                success: true,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    },

    deleteBike: async (request, response) => {
        try {
            const { id } = request.params; // assuming the bike ID is sent as a URL parameter

            const deletedBike = await bikeModel.findByIdAndDelete(id);

            if (!deletedBike) {
                return response.status(404).json({
                    message: 'Bike not found',
                    success: false,
                });
            }

            return response.status(200).json({
                message: 'Bike deleted successfully',
                success: true,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    },

    getBikeDetails: async (request, response) => {
        try {
            const { id } = request.params; // assuming the bike ID is sent as a URL parameter

            const bike = await bikeModel.findById(id);

            if (!bike) {
                return response.status(404).json({
                    message: 'Bike not found',
                    success: false,
                });
            }

            return response.status(200).json({
                message: 'Bike details retrieved successfully',
                data: bike,
                success: true,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    },

    updateBikeStatusOrLocation: async (request, response) => {
        try {
            const { id } = request.params;
            const { status, location } = request.body;

            const updatedBike = await bikeModel.findByIdAndUpdate(id, { status, location }, { new: true });

            if (!updatedBike) {
                return response.status(404).json({
                    message: 'Bike not found',
                    success: false,
                });
            }

            return response.status(200).json({
                message: 'Bike status or location updated successfully',
                data: updatedBike,
                success: true,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    }
};

module.exports = BikeController;
