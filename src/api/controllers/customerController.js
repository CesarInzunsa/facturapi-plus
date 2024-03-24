const customerModel = require('../models/customerModel');
const tools = require('../tools/tools');

// Projection to excluding the _id field
const projection = {_id: 0};

// Get customer by id
async function getCustomerById(rfc) {
    try {
        const customer = await customerModel.findOne({rfc: rfc}, projection, null);
        if (customer === null) {
            return {status: 404, message: 'Customer not found.'};
        }
        return {status: 200, data: customer};
    } catch (error) {
        console.error('Error getting customer:', error);
        return {status: 500, message: 'Internal server error while getting the customer.'};
    }
}

// Get all customers
async function getAllCustomers() {
    try {
        const customers = await customerModel.find(null, projection, null);
        if (customers.length === 0) {
            return {status: 404, message: 'No customers found.'};
        }
        return {status: 200, data: customers};
    } catch (error) {
        console.error('Error getting customers:', error);
        return {status: 500, message: 'Internal server error while getting the customers.'};
    }
}

// Create a new customer
async function createCustomer(customer) {
    try {
        // Create a new customer
        const newCustomer = new customerModel(customer);

        // Get location data from zip code
        const location = await tools.getDataFromZip(newCustomer.address.zip);

        // If location data is not null, add it to the customer
        if (location !== null) {
            newCustomer.address.city = location.city;
            newCustomer.address.municipality = location.municipality;
            newCustomer.address.state = location.state;
            newCustomer.address.country = location.country;
        }

        // Save the customer
        const customerSaved = await newCustomer.save();

        // If the customer is not saved, return an error
        if (customerSaved === null) {
            return {status: 500, message: 'Internal server error while creating the customer.'};
        }

        // Create an object to return the customer but without the _id field
        const customerData = customerSaved.toObject();
        delete customerData._id;

        // Return the new customer
        return {status: 201, message: 'Customer created successfully.', data: customerData};
    } catch (error) {
        console.error('Error creating customer:', error);
        return {status: 500, message: 'Internal server error while creating the customer.'};
    }
}

// Update a customer
async function updateCustomer(rfc, customer) {
    try {
        // Find the customer
        const customerFound = await customerModel.findOne({rfc: rfc}, null, null);

        // If the customer is not found, return an error
        if (customerFound === null) {
            return {status: 404, message: 'Customer not found.'};
        }

        // Update the customer
        const customerUpdated = await customerModel.findOneAndUpdate({rfc: rfc}, customer, {new: true});

        // If the customer is not updated, return an error
        if (customerUpdated === null) {
            return {status: 500, message: 'Internal server error while updating the customer.'};
        }

        // Create an object to return the customer but without the _id field
        const customerData = customerUpdated.toObject();
        delete customerData._id;

        // Return the updated customer
        return {status: 200, message: 'Customer updated successfully.', data: customerData};
    } catch (error) {
        console.error('Error creating customer:', error);
        return {status: 500, message: 'Internal server error while creating the customer.'};
    }
}

// Delete a customer
async function deleteCustomer(rfc) {
    try {
        // Find the customer
        const customerFound = await customerModel.findOne({rfc: rfc}, null, null);

        // If the customer is not found, return an error
        if (customerFound === null) {
            return {status: 404, message: 'Customer not found.'};
        }

        // Delete the customer
        const customerDeleted = await customerModel.findOneAndDelete({rfc: rfc}, null);

        // Create an object to return the customer but without the _id field
        const customerData = customerDeleted.toObject();
        delete customerData._id;

        // Return the deleted customer
        return {status: 200, message: 'Customer deleted successfully.', data: customerData};
    } catch (error) {
        console.error('Error creating customer:', error);
        return {status: 500, message: 'Internal server error while creating the customer.'};
    }
}

module.exports = {
    getCustomerById,
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}