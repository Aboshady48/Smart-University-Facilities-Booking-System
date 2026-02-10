const express = require('express');
const mainRouter = express.Router();
const authRouter = require('../auth/router/auth.route.js');
const resourcesRouter = require('../resources/router/resources.route.js');

mainRouter.use('/resources', resourcesRouter);

mainRouter.use('/auth', authRouter);

module.exports = mainRouter;