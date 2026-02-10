const express = require('express');
const mainRouter = express.Router();
const authRouter = require('../auth/router/auth.route.js');
const resourcesRouter = require('../resources/router/resources.route.js');
const bookingRouter = require('../booking/router/booking.route.js');
const policiesRouter = require('../policies/router/polices.route.js');

mainRouter.use('/policies', policiesRouter);

mainRouter.use('/bookings', bookingRouter);

mainRouter.use('/resources', resourcesRouter);

mainRouter.use('/auth', authRouter);

module.exports = mainRouter;