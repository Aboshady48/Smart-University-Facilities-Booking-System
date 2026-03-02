const express = require('express');
const bookingRouter = express.Router();

const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    approveBooking
} = require('../controller/booking.controller');

const { verifyToken } = require('../../middleware/verifyToken');

bookingRouter.get('/', getBookings);
bookingRouter.get('/:bookingId', getBooking);
bookingRouter.post('/', verifyToken, createBooking);
bookingRouter.post('/:bookingId/approve', verifyToken, approveBooking);
bookingRouter.put('/:bookingId', verifyToken, updateBooking);
bookingRouter.delete('/:bookingId', verifyToken, deleteBooking);

module.exports = bookingRouter;