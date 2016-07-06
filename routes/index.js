'use strict';
const express = require('express');
const router = express.Router();

const api = require('../controllers/api');

router.get(`/api/init`, api.init);
router.post(`/api/add`, api.add);
router.post(`/api/edit`, api.edit);
router.delete(`/api/delete`, api.del);


module.exports = router;
