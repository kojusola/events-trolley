const router = require('express').Router();
const ticketController = require('../controllers/user/ticket/user.ticket.controller');
const { verifyToken,restrictTo } = require('../middlewares/authorization.middleware');
const upload = require("./../helper/multer");

// router.get('/:id', verifyToken , ticketController.createNewTicket);
// router.get('/',ticketController.getAllTickets;)
router.post('/',verifyToken,restrictTo("vendor"),upload.single('image'),ticketController.createNewTicket);
router.get('/', verifyToken,ticketController.getOneTicket);
router.get('/users',verifyToken,ticketController.vendorTickets);
router.get('/delete',verifyToken,ticketController.deleteTicket);
router.patch('/updateImg',verifyToken,upload.single('image'),ticketController.updateTicketImage);
router.patch('/update',verifyToken,restrictTo("vendor"), ticketController.updateTicket);

module.exports = router;