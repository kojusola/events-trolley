const router = require('express').Router();
const userController = require('../../controllers/admin/auth/admin.auth.controller')

router.post('/register', userController.adminRegister);
router.post('/login', userController.adminLogin);
router.post('/reset-password', userController.resetPassword);
router.patch('/reset-password', userController.updatePassword )
module.exports = router;