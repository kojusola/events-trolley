const router = require('express').Router();
const ticketController = require('../controllers/user/ticket/user.ticket.controller');
const adminTicketController = require('../controllers/admin/ticket/admin.ticket.controller');
const { verifyToken,restrictTo } = require('../middlewares/authorization.middleware');
const upload = require("./../helper/multer");

// router.get('/:id', verifyToken , ticketController.createNewTicket);
// router.get('/',ticketController.getAllTickets;)
router.post('/',verifyToken,restrictTo("vendor"),ticketController.createNewTicket);
router.get('/', verifyToken,ticketController.getOneTicket);
router.get('/users',verifyToken,ticketController.vendorTickets);
router.get('/delete',verifyToken,ticketController.deleteTicket);
router.patch('/updateImg',verifyToken,upload.single('image'),ticketController.updateTicketImage);
router.patch('/update',verifyToken,restrictTo("vendor"), ticketController.updateTicket);
router.post('/buy',ticketController.buyTicket);
router.post('/user/buy',verifyToken,ticketController.regBuyTicket);
router.get('/all',verifyToken,restrictTo("admin"),adminTicketController.getAllTickets);
router.get('/verify',verifyToken,restrictTo("admin"),adminTicketController.verifyTicket);

module.exports = router;