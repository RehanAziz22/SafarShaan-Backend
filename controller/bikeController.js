const mongoose = require("mongoose");

const bikeModel = require("../model/bikeSchema.js");

const BikeController = {
    // Controller function to get all bike details
    getAllBikes: async (req, res) => {
        try {
            const bikes = await bikeModel.find();

            if (bikes.length === 0) {
                return res.status(404).json({ message: 'No bikes found' });
            }

            res.status(200).json(bikes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    // addBike: async (req, res) => {
    //     try {
    //         const { plateNo, model, status, location, fuelLevel,
    //             lastMaintenanceDate, additionalInfo, rentedBy,
    //             totalEarnings, totalCosts, ratePerMin, ratePerKm,
    //             fuel, fuelConsumption, mileage, fuelEfficiency,
    //             rideHistory, } = req.body;

    //         // Generate default location
    //         const defaultLocation = {
    //             type: 'Point',
    //             coordinates: generateRandomCoordinates(minLat, maxLat, minLng, maxLng) // Replace with your desired coordinates
    //         };

    //         const objToSend = {
    //             plateNo,
    //             model,
    //             status: status || 'available', // Default status if not provided
    //             location: location || defaultLocation,
    //             fuelLevel,
    //             lastMaintenanceDate,
    //             additionalInfo,
    //             rentedBy,
    //             totalEarnings,
    //             totalCosts,
    //             ratePerMin,
    //             ratePerKm,
    //             fuel,
    //             fuelConsumption,
    //             mileage,
    //             fuelEfficiency,
    //             rideHistory,
    //         }

    //         // if (!plateNo && !model) {
    //         //     return response.json({
    //         //         message: 'Required fields are missing',
    //         //         status: false,
    //         //     });
    //         // }
    //         const newBike = await bikeModel.create(objToSend);

    //         res.status(201).json({ message: 'Bike added successfully', data: newBike });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // },


    addBike: async (req, res) => {
        try {
            const { plateNo, model, status, location, fuelLevel,
                lastMaintenanceDate, additionalInfo, rentedBy,
                totalEarnings, totalCosts, ratePerMin, ratePerKm,
                fuel, fuelConsumption, mileage, fuelEfficiency,
                rideHistory,markerVisible,fuelTankCapacity,rideStartEnd } = req.body;

            // Check if required fields are provided
            if (!plateNo || !model) {
                return res.status(400).json({
                    message: 'Required fields are missing: plateNo and model are mandatory',
                    status: false,
                });
            }

            const defaultLocation = {
                type: 'Point',
                coordinates: [24.8607, 67.0111]
            };

            const objToSend = {
                plateNo,
                model,
                status: status || 'available', // Default status if not provided
                location: location || defaultLocation,
                fuelLevel,
                lastMaintenanceDate,
                additionalInfo,
                rentedBy,
                totalEarnings,
                totalCosts,
                ratePerMin,
                ratePerKm,
                fuel,
                fuelConsumption,
                mileage,
                fuelEfficiency,
                rideHistory,
                markerVisible,
                fuelTankCapacity,
                rideStartEnd
            };
            const existingBike = await bikeModel.findOne({ plateNo });

            if (existingBike) {
                return res.json({
                    message: 'Bike already Registered',
                    success: false,
                });
            }

            const newBike = await bikeModel.create(objToSend);
            res.status(201).json({ 
                message: 'Bike added successfully', 
                data: newBike,
                success: true });

        } catch (error) {
            console.error('Error adding bike:', error);

            

            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    updateBikeDetails: async (request, response) => {
        try {
            const { id } = request.params; // assuming the bike ID is sent as a URL parameter
            const updateData = request.body;
            console.log("Updating bike with ID:", id); // Log bike ID
            console.log("Update data:", updateData); // Log the data being sent
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
