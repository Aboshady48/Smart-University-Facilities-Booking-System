const express = require('express');
const authRouter = express.Router();

const {
  studentLogin,
  studentRegister,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
} = require('../controller/student.auth');
const { verifyToken } = require('../../middleware/verifyToken');

authRouter.post('/student/login', studentLogin);
authRouter.post('/student/register', studentRegister);
authRouter.get('/student/profile/:studentId', verifyToken, getProfile);
authRouter.put('/student/profile/:studentId', verifyToken, updateProfile);


authRouter.post('/token/refresh', refreshAccessToken);
authRouter.post('/logout', logout);

module.exports = authRouter;
