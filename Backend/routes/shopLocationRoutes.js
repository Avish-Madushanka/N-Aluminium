// backend/routes/shopLocationRoutes.js
const express = require('express');
const {
    getAllShopLocations,
} = require('../controllers/shopLocationController'); 

const router = express.Router();

router.route('/')
    .get(getAllShopLocations);

module.exports = router;