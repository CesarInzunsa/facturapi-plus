const billModel = require('../models/billModel');
const customerModel = require('../models/customerModel');
const productModel = require('../models/productModel');
const tools = require('../tools/tools');
const {getDataFromZip} = require("../tools/tools");

// Projection to excluding the _id field
const projection = {_id: 0};

// Get bill by id
async function getBillById(id) {
    try {
        const bill = await billModel.findOne({id: id}, projection, null);
        if (bill === null) {
            return {status: 404, message: 'Bill not found.'};
        }
        return {status: 200, data: bill};
    } catch (error) {
        console.error('Error getting bill:', error);
        return {status: 500, message: 'Internal server error while getting the bill.'};
    }
}

// Get all bills
async function getAllBills() {
    try {
        const bills = await billModel.find(null, projection, null);
        if (bills.length === 0) {
            return {status: 404, message: 'No bills found.'};
        }
        return {status: 200, data: bills};
    } catch (error) {
        console.error('Error getting bills:', error);
        return {status: 500, message: 'Internal server error while getting the bills.'};
    }
}

// Create a new bill
async function createBill(bill) {
    try {
        // Create a new bill
        const newBill = new billModel(bill);

        // Find the customer
        const customerFound = await customerModel.findOne({rfc: newBill.customer.rfc}, projection, null);

        // If the customer is not found, return an error
        if (customerFound === null) {
            return {status: 404, message: 'Customer not found.'};
        }

        // Save the ids of the products
        let productsIds = [];

        newBill.items.forEach(item => {
            productsIds.push(item.product.id);
        });

        // Find the products
        const productFound = await productModel.find({id: {$in: productsIds}}, projection, null);

        // If the product is not found, return an error
        if (productFound === null || productFound.length === 0) {
            return {status: 404, message: 'Product not found.'};
        }

        // Replace the customer id with the customer data
        // Marca error porque no tiene el campo de createAt
        newBill.customer = new customerModel(customerFound);

        // Replace the product id with the product data
        newBill.items.forEach(item => {
            item.product = new productModel(productFound.find(product => product.id === item.product.id));
        });

        // Get location data from zip code
        const locationData = await getDataFromZip(newBill.address.zip);

        // If the location is null, return an error
        if (locationData === null) {
            return {status: 404, message: 'Location not found.'};
        }

        // If location data is not null, add it to the bill
        if (locationData !== null) {
            newBill.address.city = locationData.city;
            newBill.address.municipality = locationData.municipality;
            newBill.address.state = locationData.state;
            newBill.address.country = locationData.country;
        }

        // Save the bill
        const billSaved = await newBill.save();
        //
        // If the bill is not saved, return an error
        if (billSaved === null) {
            return {status: 500, message: 'Internal server error while creating the bill.'};
        }
        //
        // Create an object to return the bill but without the _id field
        const billData = billSaved.toObject();
        delete billData._id;

        // Return the new bill
        return {status: 201, message: 'Bill created successfully.', data: billData};
    } catch
        (error) {
        console.error('Error creating bill:', error);
        return {status: 500, message: 'Internal server error while creating the Bill.'};
    }
}

// Update a bill
async function updateBill(id, bill) {
    try {
        // Find the bill
        const billFound = await billModel.findOne({id: id}, null, null);

        // If the bill is not found, return an error
        if (billFound === null) {
            return {status: 404, message: 'Bill not found.'};
        }

        // Check if the bill has the customer data
        if (bill.customer) {
            // Find the customer
            const customerFound = await customerModel.findOne({rfc: bill.customer.rfc}, projection, null);

            // If the customer is not found, return an error
            if (customerFound === null) {
                return {status: 404, message: 'Customer not found.'};
            }

            // Replace the customer id with the customer data
            bill.customer = new customerModel(customerFound);
        }

        // Check if the bill has the items data
        if (bill.items) {
            // Save the ids of the products
            let productsIds = [];

            bill.items.forEach(item => {
                productsIds.push(item.product.id);
            });

            // Find the products
            const productFound = await productModel.find({id: {$in: productsIds}}, projection, null);

            // If the product is not found, return an error
            if (productFound === null || productFound.length === 0) {
                return {status: 404, message: 'Product not found.'};
            }

            // Replace the product id with the product data
            bill.items.forEach(item => {
                item.product = new productModel(productFound.find(product => product.id === item.product.id));
            });
        }

        // Update the bill
        const billUpdated = await billModel.findOneAndUpdate({id: id}, bill, {new: true});

        // If the bill is not updated, return an error
        if (billUpdated === null) {
            return {status: 500, message: 'Internal server error while updating the bill.'};
        }

        // Create an object to return the bill but without the _id field
        const billData = billUpdated.toObject();
        delete billData._id;

        // Return the updated bill
        return {status: 200, message: 'Bill updated successfully.', data: billData};
    } catch (error) {
        console.error('Error creating bill:', error);
        return {status: 500, message: 'Internal server error while creating the bill.'};
    }
}

// Delete a bill
async function deleteBill(id) {
    try {
        // Find the bill
        const billFound = await billModel.findOne({id: id}, null, null);

        // If the bill is not found, return an error
        if (billFound === null) {
            return {status: 404, message: 'Bill not found.'};
        }

        // Delete the bill by updating the status to canceled
        const billDeleted = await billModel.findOneAndUpdate({id: id}, {status: 'canceled'}, {new: true});

        // Create an object to return the bill but without the _id field
        const billData = billDeleted.toObject();
        delete billData._id;

        // Return the deleted bill
        return {status: 200, message: 'Bill deleted successfully.', data: billData};
    } catch (error) {
        console.error('Error creating bill:', error);
        return {status: 500, message: 'Internal server error while creating the bill.'};
    }
}

module.exports = {
    getBillById,
    getAllBills,
    createBill,
    updateBill,
    deleteBill,
}