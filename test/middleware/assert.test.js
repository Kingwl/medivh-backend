const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

describe('test/middleware/assert.test.js', () => {
    describe('GET /article/:id', () => {
        it('should return "id is invalid"', done => {
            request.get('/article/8888888').end((err, result) => {
                let data = result.res.text;
                assert.equal(400, result.status, 'response status code should be 400');
                assert.isString(data, 'response data should be string');
                assert.equal('id is invalid', data, 'article length should equal "id is invalid"');
                done();
            });
        });
    });
});