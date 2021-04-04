const router = require('express').Router();
const adminController = require('../../controllers/admin/profile/admin.profile.controller');
const { verifyToken, restrictTo } = require('../../middlewares/authorization.middleware');


router.get('/', verifyToken, adminController.adminProfile);

module.exports = router;