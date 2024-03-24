const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    id: {type: String, required: true},
    description: {type: String, required: true},
    product_key: {type: Number, required: true},
    price: {type: Number, required: true},
    tax_included: {type: Boolean, required: true},
    taxability: {type: String, required: true},
    taxes: {
        type: {type: String, required: true},
        rate: {type: Number, required: true},
    },
    unit_name: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
}, {versionKey: false});

module.exports = mongoose.model('products', productsSchema, 'products',);