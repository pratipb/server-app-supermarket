const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');

const app = require('../app');

describe('Supermarket Checkout API', () => {
    let server;

    before((done) => {
        server = app.listen(3000, done);
    });

    after((done) => {
        server.close(done);
    });

    describe('POST /checkout', () => {
        it('should return the correct receipt for a valid checkout request', (done) => {
            const checkoutRequest = {
                items: [
                    { productId: 1, quantity: 3 },
                ],
                userDetails: {
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            };

            supertest(app)
                .post('/checkout')
                .send(checkoutRequest)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.have.property('items');
                    expect(res.body).to.have.property('totalPrice');
                    expect(res.body).to.have.property('totalAfterDiscount');
                    expect(res.body).to.have.property('userDetails');
                    expect(res.body).to.have.property('timestamp');

                    // Add additional assertions as needed

                    done();
                });
        });

        it('should return an error for an invalid checkout request', (done) => {
            const invalidCheckoutRequest = {
                items: [],
                userDetails: {
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            };

            supertest(app)
                .post('/checkout')
                .send(invalidCheckoutRequest)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.have.property('error');

                    done();
                });
        });
    });
});
