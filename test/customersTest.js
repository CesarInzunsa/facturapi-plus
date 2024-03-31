const request = require('supertest');
const expect = require('chai').expect;
const serverURL = 'http://localhost:3000';

describe('GET /customer', () => {
    it('1.Prueba: Obtener todos los clientes', (done) => {
        request(serverURL).get('/customer').expect(200) // Esperamos un código de estado 200
            .end((err, res) => {
                if (err) return done(err);
                // Verifica que la respuesta contenga un arreglo de clientes
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
});