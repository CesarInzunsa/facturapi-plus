const productModel = require("../models/productModel");
const {v4: uuidv4} = require('uuid');

// Projection to excluding the _id field
const projection = {_id: 0};

// Function to generate a random id
function generateId(){
    return uuidv4().replace(/-/g, "").substring(0, 24);
}

// get product by id
async function getProductById(id) {
    try {
        const product = await productModel.findOne({id: id}, projection, null);
        if (product === null) {
            return {status: 404, message: 'Product not found.'};
        }
        return {status: 200, data: product};
    } catch (error) {
        console.error('Error getting product:', error);
        return {status: 500, message: 'Internal server error while getting the product.'};
    }
}

// get all products
async function getAllProducts() {
    try {
        const products = await productModel.find(null, projection, null);
        if (products.length === 0) {
            return {status: 404, message: 'No products found.'};
        }
        return {status: 200, data: products};
    } catch (error) {
        console.error('Error getting products:', error);
        return {status: 500, message: 'Internal server error while getting the products.'};
    }
}

// create a new product
async function createProduct(product) {
    try {
        // Create a new product
        const newProduct = new productModel(product);

        // Generate and set the id
        newProduct.id = generateId();

        // Save the product
        const productSaved = await newProduct.save();

        // If the product is not saved, return an error
        if (productSaved === null) {
            return {status: 500, message: 'Internal server error while creating the product.'};
        }

        // Create an object to return the product but without the _id field
        const productData = productSaved.toObject();
        delete productData._id;

        // Return the new product
        return {status: 201, message: 'Product created successfully.', data: productData};
    } catch (error) {
        console.error('Error creating product:', error);
        return {status: 500, message: 'Internal server error while creating the product.'};
    }
}

// update a product
async function updateProduct(id, product) {
    try {
        // Find the product
        const productFound = await productModel.findOne({id: id}, null, null);

        // If the product is not found, return an error
        if (productFound === null) {
            return {status: 404, message: 'Product not found.'};
        }

        // Update the product
        const productUpdated = await productModel.findOneAndUpdate({id: id}, product, {new: true});

        // If the product is not updated, return an error
        if (productUpdated === null) {
            return {status: 500, message: 'Internal server error while updating the product.'};
        }

        // Create an object to return the product but without the _id field
        const productData = productUpdated.toObject();
        delete productData._id;

        // Return the updated product
        return {status: 200, message: 'Product updated successfully.', data: productData};
    } catch (error) {
        console.error('Error creating product:', error);
        return {status: 500, message: 'Internal server error while creating the product.'};
    }
}

// delete a product
async function deleteProduct(id) {
    try {
        // Find the product
        const productFound = await productModel.findOne({id: id}, null, null);

        // If the product is not found, return an error
        if (productFound === null) {
            return {status: 404, message: 'Product not found.'};
        }

        // Delete the product
        const productDeleted = await productModel.findOneAndDelete({id: id}, null);

        // Create an object to return the product but without the _id field
        const productData = productDeleted.toObject();
        delete productData._id;

        // Return the deleted product
        return {status: 200, message: 'Product deleted successfully.', data: productData};
    } catch (error) {
        console.error('Error creating product:', error);
        return {status: 500, message: 'Internal server error while creating the product.'};
    }
}

module.exports = {
    getProductById,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
}