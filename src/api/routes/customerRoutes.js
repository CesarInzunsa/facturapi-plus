const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Get all customers
router.get('/', async (req, res) => {
    const response = await customerController.getAllCustomers();
    res.status(response.status).json(response);
});

module.exports = router;