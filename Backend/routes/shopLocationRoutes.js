const express = require('express');
const {
    createShopLocation,       
    getAllShopLocations,
    getShopLocationById,
    updateShopLocation,
    deleteShopLocation
} = require('../controllers/shopLocationController'); 

const router = express.Router();

router.route('/')
    .get(getAllShopLocations)
    .post(createShopLocation);  

router.route('/:id')
    .get(getShopLocationById)
    .put(updateShopLocation)
    .delete(deleteShopLocation);

module.exports = router;