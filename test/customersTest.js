const request = require('supertest');
const expect = require('chai').expect;
const serverURL = 'http://localhost:3000';

describe('GET /customer', () => {
    it('1. Prueba: Obtener todos los clientes', (done) => {
        request(serverURL).get('/customer').expect(200) // Esperamos un código de estado 200
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga un arreglo de clientes
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});

describe('GET /customer/:id', () => {
    it('2. Prueba: Obtener un cliente por su RFC', (done) => {
        const customerRFC = "RFC-3131031";
        const expectedCustomer = {
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
            },
            "createdAt": "2024-03-18T02:51:14.943Z"
        };

        request(serverURL)
            .get(`/customer/${customerRFC}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta coincida con el producto esperado
                expect(res.body.data).to.deep.equal(expectedCustomer);
                done();
            });
    });

    it('3. Prueba: Obtener un codigo de error cuando no exista el cliente', (done) => {
        const customerRFC = 'RFC-6666666';

        request(serverURL)
            .get(`/customer/${customerRFC}`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que exista un mensaje indicando que el cliente no existe
                expect(res.body.message).to.equal('Customer not found.');
                done();
            });
    });
});

let customerTest = {
    "legal_name": "Cesar Inzunsa",
    "rfc": "PEGJ850415A1",
    "tax_system": "Impuestos",
    "email": "cesar@inzunsa.com",
    "address": {
        "zip": "63175"
    }
};

describe('POST /customer', () => {
    it('4. Prueba: Crear un nuevo cliente con un ZIP valido', (done) => {
        request(serverURL)
            .post('/customer')
            .send(customerTest)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga el cliente creado
                expect(res.body.data.rfc).to.deep.include(customerTest.rfc);
                // Verifica que el cliente creado tenga una propiedad address con un objeto que contenga el ZIP, ciudad, municipio, estado y país
                expect(res.body.data.address).to.have.property('zip');
                expect(res.body.data.address).to.have.property('city');
                expect(res.body.data.address).to.have.property('municipality');
                expect(res.body.data.address).to.have.property('state');
                expect(res.body.data.address).to.have.property('country');
                done();
            });
    });
});

describe('POST /customer', () => {
    it('5. Prueba: Crear un nuevo cliente con un ZIP inválido', (done) => {
        // Crear una copia del cliente de prueba
        let customerTestCopy = JSON.parse(JSON.stringify(customerTest));
        // Cambiar el ZIP del cliente de prueba por uno inválido
        customerTestCopy.address.zip = '00000';
        request(serverURL)
            .post('/customer')
            .send(customerTestCopy)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que exista un mensaje indicando que la localidad no fue encontrada
                expect(res.body.message).to.equal('Location not found.');
                done();
            });
    });
});

describe('PUT /customer/:id', () => {
    it('6. Prueba: Actualizar un cliente con un codigo de ZIP diferente', (done) => {
        // Crear una copia del cliente de prueba
        let customerTestCopy = JSON.parse(JSON.stringify(customerTest));
        // Modificar el zip del cliente de prueba
        customerTestCopy.address.zip = '63176';

        request(serverURL)
            .put(`/customer/${customerTest.rfc}`)
            .send(customerTestCopy)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga el cliente con el ZIP modificado
                expect(res.body.data.address.zip).to.equal(customerTestCopy.address.zip);
                done();
            });
    });

    it('7. Prueba: Actualizar un cliente con un codigo de ZIP inválido', (done) => {
        // Crear una copia del cliente de prueba
        let customerTestCopy = JSON.parse(JSON.stringify(customerTest));
        // Modificar el zip del cliente de prueba por uno inválido
        customerTestCopy.address.zip = '00000';

        request(serverURL)
            .put(`/customer/${customerTestCopy.rfc}`)
            .send(customerTestCopy)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que exista un mensaje indicando que la localidad no fue encontrada
                expect(res.body.message).to.equal('Location not found.');
                done();
            });
    });

    it('8. Prueba: Actualizar un cliente con una corrección en el nombre', (done) => {
        // Crear una copia del cliente de prueba
        let customerTestCopy = JSON.parse(JSON.stringify(customerTest));
        // Modificar el nombre del cliente de prueba
        customerTestCopy.legal_name = 'Cesar Inzunza';

        request(serverURL)
            .put(`/customer/${customerTestCopy.rfc}`)
            .send(customerTestCopy)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga el cliente con el nombre modificado
                expect(res.body.data.legal_name).to.equal(customerTestCopy.legal_name);
                done();
            });
    });
});

describe('DELETE /customer/:id', () => {
    it('9. Prueba: Eliminar un cliente', (done) => {
        request(serverURL)
            .delete(`/customer/${customerTest.rfc}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga un mensaje indicando que el cliente fue eliminado
                expect(res.body.message).to.equal('Customer deleted successfully.');
                done();
            });
    });
});