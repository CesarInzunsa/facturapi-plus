const customerModel = require('../models/customerModel');

// Projection to excluding the _id field
const projection = {_id: 0};

// Get all customers
async function getAllCustomers() {
    try {
        const customers = await customerModel.find(null, projection, null);
        return {status: 200, data: customers};
    } catch (error) {
        console.error('Error getting customers:', error);
        return {status: 500, message: 'Internal server error while getting the customers.'};
    }
}

module.exports = {
    getAllCustomers
}