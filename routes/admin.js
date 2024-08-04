// routes/adminRoutes.js
const {Router} = require('express')
const router = Router()
const AdminController = require('../controller/adminController.js');

router.post('/admin/signup', AdminController.adminSignUp);
router.post('/admin/login', AdminController.adminLogin);

module.exports = router;
