const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get product by id
router.get('/:id', async (req, res) => {
    console.log('GET /product/:id');
    const id = req.params.id;
    const result = await productController.getProductById(id);
    res.status(result.status).json(result);
});

// Get all products
router.get('/', async (req, res) => {
    console.log('GET /product');
    const result = await productController.getAllProducts();
    res.status(result.status).json(result);
});

// Create a new product
router.post('/', async (req, res) => {
    console.log('POST /product');
    const product = req.body;
    const result = await productController.createProduct(product);
    res.status(result.status).json(result);
});

// Update a product
router.put('/:id', async (req, res) => {
    console.log('PUT /product/:id');
    const id = req.params.id;
    const product = req.body;
    const result = await productController.updateProduct(id, product);
    res.status(result.status).json(result);
});

// Delete a product
router.delete('/:id', async (req, res) => {
    console.log('DELETE /product/:id');
    const id = req.params.id;
    const result = await productController.deleteProduct(id);
    res.status(result.status).json(result);
});

module.exports = router;