const express = require('express');
const mainRouter = express.Router();
const authRouter = require('../auth/router/auth.route.js');
const resourcesRouter = require('../resources/router/resources.route.js');
const bookingRouter = require('../booking/router/booking.route.js');
const policiesRouter = require('../policies/router/polices.route.js');
const auditLogsRouter = require('../audit_logs/router/audit_logs.route.js');

mainRouter.use('/audit-logs', auditLogsRouter);

mainRouter.use('/policies', policiesRouter);

mainRouter.use('/bookings', bookingRouter);

mainRouter.use('/resources', resourcesRouter);

mainRouter.use('/auth', authRouter);

module.exports = mainRouter;