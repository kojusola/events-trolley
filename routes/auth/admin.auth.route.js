const router = require('express').Router();
const userController = require('../../controllers/admin/auth/admin.auth.controller')
const adminTicketController = require('../../controllers/admin/ticket/admin.ticket.controller');
const usersController = require('../../controllers/admin/usersProfile/usersProfile');
const { verifyToken, restrictTo } = require('../../middlewares/authorization.middleware');

router.post('/register', userController.adminRegister);
router.post('/login', userController.adminLogin);
router.post('/reset-link', userController.resetPassword);
router.patch('/reset-password', userController.updatePassword);
router.get('/users', verifyToken, restrictTo("admin"),usersController.getAllUsersProfile);
router.post('/users', verifyToken, restrictTo("admin"), usersController.getUsersProfileByRole);
router.get('/users-profile', verifyToken, restrictTo("admin"), usersController.getOneProfile);
router.post('/update-percentage', verifyToken, restrictTo("admin"), adminTicketController.updateVendorPayoutPercentage);
module.exports = router;