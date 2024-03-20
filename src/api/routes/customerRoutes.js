const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Get customer by id
router.get('/:rfc', async (req, res) => {
    console.log('GET /customer/:rfc');
    const rfc = req.params.rfc;
    const response = await customerController.getCustomerById(rfc);
    res.status(response.status).json(response);
});

// Get all customers
router.get('/', async (req, res) => {
    console.log('GET /customer');
    const response = await customerController.getAllCustomers();
    res.status(response.status).json(response);
});

// Create a new customer
router.post('/', async (req, res) => {
    console.log('POST /customer');
    const customer = req.body;
    const response = await customerController.createCustomer(customer);
    res.status(response.status).json(response);
});

// Update a customer
router.put('/:rfc', async (req, res) => {
    console.log('PUT /customer/:rfc');
    const rfc = req.params.rfc;
    const customer = req.body;
    const response = await customerController.updateCustomer(rfc, customer);
    res.status(response.status).json(response);
});

// Delete a customer
router.delete('/:rfc', async (req, res) => {
    console.log('DELETE /customer/:rfc');
    const rfc = req.params.rfc;
    const response = await customerController.deleteCustomer(rfc);
    res.status(response.status).json(response);
});

module.exports = router;