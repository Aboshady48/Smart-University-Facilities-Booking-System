const express = require('express');
const policiesRouter = express.Router();

const {
    getPolicies,
    getPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy
} = require('../controller/policies.controller');

const { verifyToken } = require('../../middleware/verifyToken');

policiesRouter.get('/', getPolicies);
policiesRouter.get('/:policyId', verifyToken ,getPolicy);
policiesRouter.post('/', verifyToken, createPolicy);
policiesRouter.put('/:policyId', verifyToken, updatePolicy);
policiesRouter.delete('/:policyId', verifyToken, deletePolicy);

module.exports = policiesRouter;