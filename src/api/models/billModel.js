const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    id: {type: String, required: true},
    status: {type: String, default: 'valid'}, // Estatus del comprobante. valid o canceled
    type: {type: String, default: 'I'}, // Tipo de comprobante
    payment_form: {type: String, required: true}, // Código que representa la forma de pago, de acuerdo al catálogo del SAT.
    payment_method: {type: String, required: true}, // PUE Pago en Una sola Exhibición o PPD Pago en Parcialidades o Diferido
    currency: {type: String, default: 'MXN'}, // Código de la moneda, acorde al estándar ISO 4217.
    exchange: {type: Number, default: 1}, // Tipo de cambio conforme a la moneda usada
    export: {type: String, default: '01'}, // Indica si el comprobante ampara una operación de exportación
    total: {type: Number, required: true}, // Total de la factura
    folio_number: {type: Number, default: 0}, // Número de folio asignado por la empresa para control interno. Si se omite, se asignará el valor autoincremental de la organización.
    customer: {
        legal_name: {type: String, required: true},
        rfc: {type: String, required: true},
        tax_system: {type: String, required: true},
        email: {type: String, required: true},
        address: {
            _id: false,
            zip: {type: String, required: true},
            city: {type: String, required: true},
            municipality: {type: String, required: true},
            state: {type: String, required: true},
            country: {type: String, required: true}
        },
    },
    items: [
        {
            _id: false,
            quantity: {type: Number, default: 1},
            discount: {type: Number, default: 0},
            product: {
                _id: false,
                id: {type: String, required: true},
                description: {type: String, required: true},
                product_key: {type: Number, required: true},
                price: {type: Number, required: true},
                tax_included: {type: Boolean, required: true},
                taxability: {type: String, required: true},
                taxes: {
                    _id: false,
                    type: {type: String, required: true},
                    rate: {type: Number, required: true},
                },
                unit_name: {type: String, required: true},
            }
        }
    ],
    address: {
        zip: {type: String, required: true},
        city: {type: String, required: true},
        municipality: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true}
    },
    date: {type: Date, default: Date.now}, // Fecha de expedición del comprobante. No puede ser anterior a 72 horas en el pasado, ni posterior al presente.
    createdAt: {type: Date, default: Date.now} // Fecha de creación del registro
}, {versionKey: false});

module.exports = mongoose.model('bills', billSchema, 'bills',);