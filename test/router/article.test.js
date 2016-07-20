const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

describe('test/router/article.test.js', () => {
    describe('GET /article', () => {
        it('should return array of articles', done => {
            request.get('/article').end((err, result) => {
                let data = result.res.body;
                assert.isArray(data, 'response data should be array');
                assert.equal(0, data.length, 'article length should equal 0');
                done();
            });
        })
    });

    describe('POST /article', () => {
        it('should return created article', done => {
            request.post('/article', { title: 'aaa' }).end((err, result) => {
                let data = result.res.body;
                done();
            });
        })
    });
});