const router = require('express').Router();
const webhooks = require('../../controllers/user/wallet/webhooks.controller');
const { verifyToken } = require('../../middlewares/authorization.middleware');

router.post('/', verifyToken , webhooks.paymentValidation);


module.exports = router;