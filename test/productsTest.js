const request = require('supertest');
const expect = require('chai').expect;
const serverURL = 'http://localhost:3000';

describe('GET /product', () => {
    it('Debería obtener todos los productos', (done) => {
        request(serverURL).get('/product').expect(200) // Esperamos un código de estado 200
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga un arreglo de productos
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});

describe('GET /product/:id', () => {
    it('Debería obtener un producto por su ID', (done) => {
        const productID = "6e046c7653414bc8bcc499b1";
        const expectedProduct = {
            "taxes": {
                "type": "IVA",
                "rate": 0.16
            },
            "id": "6e046c7653414bc8bcc499b1",
            "description": "Ukelele",
            "product_key": 60131324,
            "price": 345.6,
            "tax_included": true,
            "taxability": "01",
            "unit_name": "Elemento",
            "createdAt": "2024-03-23T21:24:15.621Z"
        };

        request(serverURL)
            .get(`/product/${productID}`)
            .expect(200) // Esperamos un código de estado 200
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta coincida con el producto esperado
                expect(res.body.data).to.deep.equal(expectedProduct);
                done();
            });
    });

    it('Debería devolver un error 404 si el producto no existe', (done) => {
        const productID = '6e046c7653414bc8bcc499b4';

        request(serverURL)
            .get(`/product/${productID}`)
            .expect(404) // Esperamos un código de estado 404
            .end(done);
    });
});