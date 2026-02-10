const express = require('express');
const resourcesRouter = express.Router();

const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource
} = require('../controller/resources.controller');

const { verifyToken } = require('../../middleware/verifyToken');

resourcesRouter.get('/', getResources);
resourcesRouter.get('/:resourceId', getResource);
resourcesRouter.post('/', verifyToken, createResource);
resourcesRouter.put('/:resourceId', verifyToken, updateResource);
resourcesRouter.delete('/:resourceId', verifyToken, deleteResource);

module.exports = resourcesRouter;
