const request = require('supertest');
// I'm doing this so i can delete the brand for the POST test during delete
const testID = {id: ""}

describe('Brands', () => {
    let app;
    beforeEach(() => {
        app = require('../app.js');
    });
    afterEach(() => {
        app.close();
    });

    it('gets all brands', done => {
        request(app)
            .get('/brands')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('gets a single brand', done => {
        request(app)
            .get('/brands/8c9962cb-7806-4d19-9f06-80a0efb7e9ca') // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('creates a new brand', done => {
        request(app)
            .post('/brands')
            .send({ name: 'Test Brand',
            email: "test",
            phone_number: "2",
            city: "New York",
            state: "NY",
            company_type: "brand"})
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                // I'm doing this so i can delete this test brand during delete
                testID.id = res.body.id
                expect(res.body.name).toEqual('Test Brand');

                done(res);
            });
    });

    it('finds an existing brand', done => {
        request(app)
            .get('/brands/search?q=Sample Brand 2')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a brand', done => {
        request(app)
            .get('/brands/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });
    
    it('deletes a brand', done => {
        request(app)
            .delete(`/brands/${testID.id}`) 
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.text).toEqual("Delete Successful");
                done(res);
            });
    });
});