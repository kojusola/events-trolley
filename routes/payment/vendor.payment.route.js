const router = require('express').Router();
const ticketVendorPayment = require('../../controllers/user/wallet/ticketvendor.controller');
const { verifyToken } = require('../../middlewares/authorization.middleware');

router.post('/', verifyToken , ticketVendorPayment.vendorPayOut);
router.post('/validation', verifyToken , ticketVendorPayment.otpValidation);

module.exports = router;