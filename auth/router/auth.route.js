const express = require('express');
const authRouter = express.Router();

const {
  studentLogin,
  studentRegister,
  refreshAccessToken,
  logout
} = require('../controller/student.auth');

authRouter.post('/student/login', studentLogin);
authRouter.post('/student/register', studentRegister);

authRouter.post('/token/refresh', refreshAccessToken);
authRouter.post('/logout', logout);

module.exports = authRouter;
