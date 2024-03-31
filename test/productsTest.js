const request = require('supertest');
const expect = require('chai').expect;
const serverURL = 'http://localhost:3000';

describe('GET /product', () => {
    it('1.Prueba: Obtener todos los productos', (done) => {
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
    it('2. Prueba: Obtener un producto por su ID', (done) => {
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
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta coincida con el producto esperado
                expect(res.body.data).to.deep.equal(expectedProduct);
                done();
            });
    });

    it('3. Prueba: Obtener un codigo de error cuando no exita un producto', (done) => {
        const productID = '6e046c7653414bc8bcc499b4';

        request(serverURL)
            .get(`/product/${productID}`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que exista un mensaje indicando que el producto no existe
                expect(res.body.message).to.equal('Product not found.');
                done();
            });
    });
});

const productTest = {
    "description": "Piano",
    "product_key": 78451236,
    "price": 1250.75,
    "tax_included": true,
    "taxability": "01",
    "taxes": {
        "type": "IVA",
        "rate": 0.16
    },
    "unit_name": "Elemento"
};
let productID = '';
describe('POST /product', () => {
    it('4. Prueba: Crear un nuevo producto', (done) => {
        request(serverURL)
            .post('/product')
            .send(productTest)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga el producto creado
                expect(res.body.data).to.deep.include(productTest);
                // Obtiene el ID del producto creado para las siguientes pruebas
                productID = res.body.data.id;
                done();
            });
    });
});

describe('PUT /product/:id', () => {
    it('5. Prueba: Actualizar un producto', (done) => {
        // Modificar el precio del producto de prueba
        productTest.price = 1500.00;

        request(serverURL)
            .put(`/product/${productID}`)
            .send(productTest)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga el producto con el precio modificado
                expect(res.body.data.price).to.equal(productTest.price);
                done();
            });
    });
});

describe('DELETE /product/:id', () => {
    it('6. Prueba: Eliminar un producto', (done) => {

        request(serverURL)
            .delete(`/product/${productID}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga el producto eliminado
                expect(res.body.data.id).to.equal(productID);
                done();
            });
    });
});