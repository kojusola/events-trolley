const router = require('express').Router();
const ticketController = require('../controllers/user/ticket/user.ticket.controller');
const { verifyToken } = require('../middlewares/authorization.middleware');

// router.get('/:id', verifyToken , ticketController.createNewTicket);
// router.get('/',ticketController.getAllTickets;)
router.post('/:id', ticketController.createNewTicket);
router.get('/:ticket_id', ticketController.getOneTicket);
router.get('/remove/:ticket_id', ticketController.deleteTicket);

module.exports = router;