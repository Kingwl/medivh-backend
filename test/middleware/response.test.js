const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

describe('test/middleware/response.test.js', () => {
    describe('GET /article', () => {
        it('should return "id is invalid"', done => {
            request.get('/article').end((err, result) => {
                let data = result.res.body;
                assert.equal(200, result.status, 'response status code should be 200');
                assert.isArray(data, 'response data should be array');
                done();
            });
        });
    });
});