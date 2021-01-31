const router = require('express').Router();
const userController = require('../../controllers/user/profile/user.profile.controller');
const { verifyToken } = require('../../middlewares/authorization.middleware');

router.get('/:id', verifyToken , userController.userProfile);

module.exports = router;