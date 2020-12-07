const router = require('express').Router();
const userController = require('../../controllers/admin/auth/admin.auth.controller')

router.post('/register', userController.adminRegister);
router.post('/login', userController.adminLogin);

module.exports = router;