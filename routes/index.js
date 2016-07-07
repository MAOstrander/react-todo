'use strict';
const express = require('express');
const router = express.Router();

const api = require('../controllers/api');

// I don't do any navigation other than making my api requests
router.get(`/api/init`, api.init);
router.post(`/api/add`, api.add);
router.post(`/api/edit`, api.edit);
router.delete(`/api/delete`, api.del);


module.exports = router;
