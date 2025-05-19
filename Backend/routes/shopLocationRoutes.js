// backend/routes/shopLocationRoutes.js
const express = require('express');
const {
    createShopLocation,       // <<<< Make sure this is imported
    getAllShopLocations,
    getShopLocationById,
    updateShopLocation,
    deleteShopLocation
} = require('../controllers/shopLocationController'); // <<<< And this path is correct

const router = express.Router();

// For GET /api/shop-locations AND POST /api/shop-locations
router.route('/')
    .get(getAllShopLocations)
    .post(createShopLocation);  // <<<< THIS LINE IS CRITICAL for "Cannot POST" error

// For GET, PUT, DELETE /api/shop-locations/:id
router.route('/:id')
    .get(getShopLocationById)
    .put(updateShopLocation)
    .delete(deleteShopLocation);

module.exports = router;