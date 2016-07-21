const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;


const Article = require('../../src/model/article');
const Reply = require('../../src/model/reply');

describe('test/router/reply.test.js', () => {
    const testReplyData = {
        name: 'testReply',
        content: 'testContent'
    };
    let testReply = null;

    beforeEach(function* () {
        testReply = new Reply(testReplyData);
        yield testReply.save();
    });

    afterEach(function* () {
        yield testReply.remove();
    });

    describe('GET /reply', () => {
        it('should return array of all reply', done => {
            request
                .get('/reply')
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let replys = result.res.body;
                    assert.isArray(replys, 'replys should be array');
                    assert.lengthOf(replys, 1, 'replys has length of 1');
                    for (let reply of replys) {
                        assert.isObject(reply, 'reply is an object');
                        assert.propertyVal(reply, 'name', testReplyData.name);
                        assert.propertyVal(reply, 'content', testReplyData.content);
                    }
                    done();
                });
        });
    });

    describe('GET /reply/:id', () => {
        it('should return selected reply object', done => {
            request
                .get(`/reply/${testReply._id}`)
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let reply = result.res.body;
                    assert.isObject(reply, 'reply is an object');
                    assert.propertyVal(reply, 'name', testReplyData.name);
                    assert.propertyVal(reply, 'content', testReplyData.content);
                    done();
                });
        });
    });

    describe('PUT /reply/:id', () => {
        const newReplyData = {
            name: 'newReply',
            content: 'newContent'
        };

        it('should return upadted reply object', done => {
            request
                .put(`/reply/${testReply._id}`)
                .send(newReplyData)
                .expect(201)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let reply = result.res.body;
                    assert.isObject(reply, 'reply is an object');
                    assert.propertyVal(reply, 'name', newReplyData.name);
                    assert.propertyVal(reply, 'content', newReplyData.content);
                    done();
                });
        });
    });

    describe('DELETE /reply/:id', () => {
        it('should return empty document', done => {
            request
                .delete(`/reply/${testReply._id}`)
                .expect(204)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');
                    assert.isUndefined(result.res.body, 'body should undefined');
                    done();
                });
        });
    });
});