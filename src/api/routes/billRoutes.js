const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Get bill by id
router.get('/:id', async (req, res) => {
    console.log('GET /bill/:id');
    const id = req.params.id;
    const response = await billController.getBillById(id);
    res.status(response.status).json(response);
});

// Get all bills
router.get('/', async (req, res) => {
    console.log('GET /bill');
    const response = await billController.getAllBills();
    res.status(response.status).json(response);
});

// Create a new bill
router.post('/', async (req, res) => {
    console.log('POST /bill');
    const bill = req.body;
    const response = await billController.createBill(bill);
    res.status(response.status).json(response);
});

// Update a bill
router.put('/:id', async (req, res) => {
    console.log('PUT /bill/:id');
    const id = req.params.id;
    const bill = req.body;
    const response = await billController.updateBill(id, bill);
    res.status(response.status).json(response);
});

// Delete a bill
router.delete('/:id', async (req, res) => {
    console.log('DELETE /bill/:id');
    const id = req.params.id;
    const response = await billController.deleteBill(id);
    res.status(response.status).json(response);
});

module.exports = router;