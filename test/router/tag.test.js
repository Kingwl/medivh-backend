const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

const Tag = require('../../src/model/Tag');

describe('test/router/tag.test.js', () => {
    const testTagData = {
        name: 'testTag'
    };
    let testTag = null;

    beforeEach(function* () {
        testTag = new Tag(testTagData);
        yield testTag.save();
    });

    afterEach(function* () {
        yield testTag.remove();
    });

    describe('GET /tag', () => {
        it('should return array of all tag', done => {
            request
                .get('/tag')
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let tags = result.res.body;
                    assert.isArray(tags, 'tags is and array');
                    assert.lengthOf(tags, 1, 'tags has length of 1');

                    for (let tag of tags) {
                        assert.isObject(tag, 'tag is an object');
                        assert.propertyVal(tag, 'name', testTagData.name);
                    };
                    done();
                });
        });
    });

    describe('POST /tag', () => {
        const newTagData = {
            name: 'newTag'
        };

        after(function* () {
            yield Tag.remove(newTagData);
        });

        it('should return created tag object', done => {
            request
                .post('/tag')
                .send(newTagData)
                .expect(201)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let tag = result.res.body;
                    assert.isObject(tag, 'tag is an object');
                    assert.propertyVal(tag, 'name', newTagData.name);
                    done();
                });
        });
    });

    describe('GET /tag/:id', () => {
        it('should return selected tag', done => {
            request
                .get(`/tag/${testTag._id}`)
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let tag = result.res.body;
                    assert.isObject(tag, 'tag is an object');
                    assert.propertyVal(tag, 'name', testTag.name);
                    done();
                });
        });
    });

    describe('DELETE /tag/:id', () => {
        it('should return empty document', done => {
            request
                .delete(`/tag/${testTag._id}`)
                .expect(204)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');
                    assert.isUndefined(result.res.body, 'body is undefined');
                    done();
                });
        });
    });

    describe('GET /tag/:id/article', () => {
        it('should return array of article whitch tag ref to', done => {
            request
                .get(`/tag/${testTag._id}/article`)
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let articles = result.res.body;
                    assert.isArray(articles, 'article is an array');
                    assert.lengthOf(articles, 0, 'articles has length of 0');
                    done();
                });
        });
    });
});