// controller/adminController.js
const Admin = require('../model/adminSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const AdminController = {
    adminSignUp: async (req, res) => {
        try {
             console.log(req.body);
            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Required fields are missing', status: false });
            }

            const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Username or Email already exists', status: false });
            }

            const admin = new Admin({ username, password, email });
            await admin.save();

            return res.status(201).json({ message: 'Admin registered successfully', status: true, admin });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error', status: false });
        }
    },

    adminLogin: async (req, res) => {
        try {
            console.log(req.body);
            
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Required fields are missing', status: false });
            }

            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.status(400).json({ message: 'Invalid credentials', status: false });
            }

            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials', status: false });
            }

            const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', status: true, token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error', status: false });
        }
    },
};

module.exports = AdminController;
