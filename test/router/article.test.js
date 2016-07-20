const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

describe('test/router/user.test.js', () => {
    describe('GET /user', () => {
        it('should return array of users', done => {
            request.get('/user').end((err, result) => {
                let data = result.res.body;
                assert.isArray(data, 'should be array of users');
                assert.equal(0, data.length, 'users length should equal 0');
                done();
            });
        })
    });
});