var mocha = require('mocha');
var coMocha = require('co-mocha');
coMocha(mocha);

const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

const Article = require('../../src/model/article');
const User = require('../../src/model/user');

describe('test/router/recycle.test.js', () => {
    const testArticleData = {
        title: 'test title',
        url: 'test url',
        content: 'test content',
        isDelete: true
    };
    const testUserData = {
        name: 'testName',
        encrypted_password: 'testPass',
        male: 0,
        age: 1
    };
    let testArticle = null;
    let testUser = null;

    beforeEach(function* () {
        testArticle = new Article(testArticleData);
        testUser = new User(testUserData);

        testUser.articles.push(testArticle._id);
        yield testArticle.save();
        yield testUser.save();
    });

    afterEach(function* () {
        yield testArticle.remove();
        yield testUser.remove();
    })

    describe('GET /recycle', () => {
        it('shoule return array of all deleted article', function* (done) {
            request
                .get('/recycle')
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let articles = result.res.body;
                    assert.isArray(articles, 'articles should be array');
                    assert.lengthOf(articles, 1, 'articles has length of 1');

                    for (let article of articles) {
                        assert.isObject(article, 'article is an object');
                        assert.propertyVal(article, 'title', testArticleData.title);
                        assert.propertyVal(article, 'url', testArticleData.url);
                        assert.propertyVal(article, 'content', testArticleData.content);
                        assert.propertyVal(article, 'isDelete', true);
                    }
                    done();
                });
        })
    });

    describe('GET /recycle/:id', () => {
        it('should return array of deleted article belong to id', function* (done) {
            request
                .get(`/recycle/${testUser._id}`)
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let articles = result.res.body;
                    assert.isArray(articles, 'articles should be array');
                    assert.lengthOf(articles, 1, 'articles has length of 1');
                    for (let article of articles) {
                        assert.isObject(article, 'article is an object');
                        assert.propertyVal(article, 'title', testArticleData.title);
                        assert.propertyVal(article, 'url', testArticleData.url);
                        assert.propertyVal(article, 'content', testArticleData.content);
                        assert.propertyVal(article, 'isDelete', true);
                    }
                    done();
                });
        });
    });

    describe('DELETE /recycle/:id', () => {
        it('should return empty document', function* (done) {
            request
                .delete(`/recycle/${testUser._id}`)
                .expect(204)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');
                    assert.isUndefined(result.res.body, 'body should undefined');
                    done();
                });
        });
    });

    describe('POST /recycle/:uid/remove/:id', () => {
        it('should return empty document', function* (done) {
            request
                .post(`/recycle/${testUser._id}/remove/${testArticle._id}`)
                .expect(204)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');
                    assert.isUndefined(result.res.body, 'body should undefined');
                    done();
                });
        });
    });

    describe('POST /recycle/:uid/recovery/:id', () => {
        it('should return recovered document', function* (done) {
            request
                .post(`/recycle/${testUser._id}/recovery/${testArticle._id}`)
                .expect(201)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let article = result.res.body;
                    assert.isObject(article, 'article is an object');
                    assert.propertyVal(article, 'title', testArticleData.title);
                    assert.propertyVal(article, 'url', testArticleData.url);
                    assert.propertyVal(article, 'content', testArticleData.content);
                    assert.propertyVal(article, 'isDelete', false);
                    done();
                });
        });
    });
});