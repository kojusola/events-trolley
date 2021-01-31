const router = require('express').Router();
const ticketController = require('../controllers/user/ticket/user.ticket.controller');
const { verifyToken } = require('../middlewares/authorization.middleware');

// router.get('/:id', verifyToken , ticketController.createNewTicket);
// router.get('/',ticketController.getAllTickets;)
router.post('/', ticketController.createNewTicket);
router.get('/', ticketController.getOneTicket);
router.get('/delete', ticketController.deleteTicket);
router.post('/update', ticketController.updateTicket);

module.exports = router;