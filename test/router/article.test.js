const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

describe('test/router/article.test.js', () => {
    describe('GET /article', () => {
        it('should return array of articles, and array length equal 0', done => {
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
            request
            .post('/article')
            .send({ 
                title: 'aaa',
                url: 'bbb',
                content: 'ccc',
            })
            .end((err, result) => {
                let data = result.res.body;
                assert.isObject(data, 'response data should be object');
                assert.equal('aaa', data.title, 'article.title should equal "aaa"');
                assert.equal('bbb', data.url, 'article.url should equal "bbb"');
                assert.equal('ccc', data.content, 'article.content should equal "ccc"');
                done();
            });
        })
    });

    describe('GET /article/:id', () => {
        it('should return article witch id equal given', done => {
            request.get('/article').end((err, result0) => {
                request.get('/article/' + result0.res.body[0]._id).end((err, result1) => {
                    let data = result1.res.body;
                    assert.isObject(data, 'response data should be object');
                    done();
                });
            });
        })
    });
});