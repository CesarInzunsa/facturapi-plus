const request = require('supertest');
const expect = require('chai').expect;
const serverURL = 'http://localhost:3000';

// Prueba para obtener todos las facturas
describe('GET /bill', () => {
    it('1. Prueba: Obtener todos las facturas', (done) => {
        request(serverURL)
            .get('/bill')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});


// Prueba para obtener una factura por su ID
describe('GET /bill/:id', () => {
    const billTest = {
        "id": "uR4k9FvE3w2q",
        "status": "canceled",
        "type": "I",
        "payment_form": "01",
        "payment_method": "PUE",
        "currency": "MXN",
        "exchange": 1,
        "export": "01",
        "total": 588,
        "folio_number": 345,
        "customer": {
            "legal_name": "Tulio Trevino",
            "rfc": "RFC-3131031",
            "tax_system": "Impuestos",
            "email": "fantasma@empresa.com",
            "address": {
                "zip": "67890",
                "city": "Guerreo",
                "municipality": "Municipio",
                "state": "Tamaulipas",
                "country": "Canada"
            }
        },
        "items": [
            {
                "quantity": 2,
                "discount": 0,
                "product": {
                    "id": "6e046c7653414bc8bcc499b1",
                    "description": "Ukelele",
                    "product_key": 60131324,
                    "price": 345.6,
                    "tax_included": true,
                    "taxability": "01",
                    "taxes": {
                        "type": "IVA",
                        "rate": 0.16
                    },
                    "unit_name": "Elemento"
                }
            },
            {
                "quantity": 72,
                "discount": 0,
                "product": {
                    "id": "6e046c7653414bc8bcc400b1",
                    "description": "Guitarra",
                    "product_key": 60131324,
                    "price": 345.6,
                    "tax_included": true,
                    "taxability": "01",
                    "taxes": {
                        "type": "IVA",
                        "rate": 0.16
                    },
                    "unit_name": "Elemento"
                }
            }
        ],
        "address": {
            "zip": "63175",
            "city": "Tepic",
            "municipality": "Tepic",
            "state": "Nayarit",
            "country": "México"
        },
        "date": "2024-03-31T01:31:38.589Z",
        "createdAt": "2024-03-31T01:31:38.590Z"
    };

    it('2. Prueba: Obtener una factura por su ID', (done) => {

        request(serverURL)
            .get(`/bill/${billTest.id}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.data).to.deep.equal(billTest);
                done();
            });
    });

    it('3. Prueba: Obtener un codigo de error cuando no exista la factura', (done) => {
        request(serverURL)
            .get(`/bill/bdbdagaga`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).to.equal('Bill not found.');
                done();
            });
    });
});

// Crear un objeto factura para las pruebas que siguen
const billTest = {
    "id": "ABC123DEF456",
    "status": "valid",
    "type": "I",
    "payment_form": "01",
    "payment_method": "PUE",
    "currency": "MXN",
    "exchange": 1,
    "export": "01",
    "total": 588,
    "folio_number": 345,
    "customer": {
        "rfc": "RFC-3131031"
    },
    "items": [
        {
            "quantity": 2,
            "discount": 0,
            "product": {
                "id": "6e046c7653414bc8bcc499b1",
            }
        },
        {
            "quantity": 72,
            "discount": 0,
            "product": {
                "id": "6e046c7653414bc8bcc400b1",
            }
        }
    ],
    "address": {
        "zip": "63175"
    }
};
const billTestWithFullData = {
    "id": "ABC123DEF456",
    "status": "valid",
    "type": "I",
    "payment_form": "01",
    "payment_method": "PUE",
    "currency": "MXN",
    "exchange": 1,
    "export": "01",
    "total": 588,
    "folio_number": 345,
    "customer": {
        "legal_name": "Tulio Trevino",
        "rfc": "RFC-3131031",
        "tax_system": "Impuestos",
        "email": "fantasma@empresa.com",
        "address": {
            "zip": "67890",
            "city": "Guerreo",
            "municipality": "Municipio",
            "state": "Tamaulipas",
            "country": "Canada"
        }
    },
    "items": [
        {
            "quantity": 2,
            "discount": 0,
            "product": {
                "id": "6e046c7653414bc8bcc499b1",
                "description": "Ukelele",
                "product_key": 60131324,
                "price": 345.6,
                "tax_included": true,
                "taxability": "01",
                "taxes": {
                    "type": "IVA",
                    "rate": 0.16
                },
                "unit_name": "Elemento"
            }
        },
        {
            "quantity": 72,
            "discount": 0,
            "product": {
                "id": "6e046c7653414bc8bcc400b1",
                "description": "Guitarra",
                "product_key": 60131324,
                "price": 345.6,
                "tax_included": true,
                "taxability": "01",
                "taxes": {
                    "type": "IVA",
                    "rate": 0.16
                },
                "unit_name": "Elemento"
            }
        }
    ],
    "address": {
        "zip": "63175",
        "city": "Tepic",
        "municipality": "Tepic",
        "state": "Nayarit",
        "country": "Mexico"
    }
};

// Prueba para crear una factura
describe('POST /bill', () => {
    it('4. Prueba: Crear una factura y comprobar que se agrega la información del cliente y productos', (done) => {
        request(serverURL)
            .post('/bill')
            .send(billTest)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                // Comprobar que la respuesta contiene la factura creada, pero que no compare la fecha ni fecha de creación
                expect(res.body.data).to.deep.include(billTestWithFullData);
                done();
            });
    });
});

// Prueba para actualizar una factura
describe('PUT /bill', () => {
    it('5. Prueba: Actualizar una factura con un código de ZIP valido', (done) => {
        // Crear una copia de la factura de prueba
        let billTestCopy = JSON.parse(JSON.stringify(billTestWithFullData));
        // Cambiar el ZIP de la factura de prueba por uno válido
        billTestCopy.address.zip = '63176';

        request(serverURL)
            .put(`/bill/${billTestCopy.id}`)
            .send(billTestCopy)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Comprobar que la respuesta contiene la factura actualizada
                expect(res.body.data).to.deep.include(billTestCopy);
                done();
            });
    });

    it('6. Prueba: Actualizar una factura con un código de ZIP invalido', (done) => {
        // Crear una copia de la factura de prueba
        let billTestCopy = JSON.parse(JSON.stringify(billTest));
        // Cambiar el ZIP de la factura de prueba por uno inválido
        billTestCopy.address.zip = '00000';

        request(serverURL)
            .put(`/bill/${billTestCopy.id}`)
            .send(billTestCopy)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                // Verificar que exista un mensaje indicando que la localidad no fue encontrada
                expect(res.body.message).to.equal('Location not found.');
                done();
            });
    });
});

// Prueba para eliminar una factura (Cambiar de estado valid a canceled).
describe('DELETE /bill/:id', () => {
    it('7. Prueba: Eliminar una factura', (done) => {
        request(serverURL)
            .delete(`/bill/${billTest.id}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verificar que la respuesta contenga el estado de la factura como canceled
                expect(res.body.data.status).to.equal('canceled');
                done();
            });
    });
});