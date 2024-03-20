const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    legal_name: {type: String, required: true},
    rfc: {type: String, required: true},
    tax_system: {type: String, required: true},
    email: {type: String, required: true},
    address: {
        zip: {type: String, required: true},
        city: {type: String, required: true},
        municipality: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true}
    },
    createdAt: {type: Date, default: Date.now}
}, {versionKey: false});

module.exports = mongoose.model('customers', customerSchema);