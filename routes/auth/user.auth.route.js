const router = require('express').Router();
const userController = require('../../controllers/user/auth/user.auth.controller');

router.post('/register/customer', userController.customerRegister);
router.post('/register/vendor', userController.vendorRegister);
router.post('/login', userController.userLogin);

module.exports = router;