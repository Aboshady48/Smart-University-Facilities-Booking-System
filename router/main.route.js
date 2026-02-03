const express = require('express');
const mainRouter = express.Router();
const authRouter = require('../auth/router/auth.route.js');

mainRouter.use('/auth', authRouter);

module.exports = mainRouter;