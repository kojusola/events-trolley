const router = require('express').Router();
const ticketController = require('../controllers/user/ticket/user.ticket.controller');
const { verifyToken,restrictTo } = require('../middlewares/authorization.middleware');

// router.get('/:id', verifyToken , ticketController.createNewTicket);
// router.get('/',ticketController.getAllTickets;)
router.post('/',verifyToken,restrictTo("vendor"), ticketController.createNewTicket);
router.get('/', verifyToken,ticketController.getOneTicket);
router.get('/delete',ticketController.deleteTicket);
router.post('/update',verifyToken,restrictTo("vendor"), ticketController.updateTicket);

module.exports = router;