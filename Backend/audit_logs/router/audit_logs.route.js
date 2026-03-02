const express = require('express');
const auditLogsRouter = express.Router();

const {
    createLog,
    getLogs
} = require('../controllers/audit_logs.controller.js');

const { verifyToken } = require('../../middleware/verifyToken');

auditLogsRouter.post('/', verifyToken, createLog);
auditLogsRouter.get('/', verifyToken, getLogs);

module.exports = auditLogsRouter;