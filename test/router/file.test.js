const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

const Article = require('../../src/model/article');

describe('test/router/file.test.js', () => {
    const now = new Date(Date.now());
    const testArticleContent = {
        title: 'test title',
        url: 'test url',
        content: 'test content'
    };
    let testArticle = null;

    beforeEach(() => {
        testArticle = new Article(testArticleContent);
        return testArticle.save();
    });

    afterEach(() => {
        return testArticle.remove();
    });

    describe('GET /file', () => {
        it('should return files info', done => {
            request
                .get('/file')
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should ok');

                    let files = result.res.body;
                    assert.isArray(files, 'files should be a array');
                    assert.lengthOf(files, 1, 'files has length of 1');

                    for (let file of files) {
                        assert.isObject(file, 'file is an object');
                        assert.propertyVal(file, '_id', `${now.getFullYear()}-${now.getMonth()}`);
                        assert.propertyVal(file, 'value', 1);
                    }
                    done();
                });
        });
    });
    describe('GET /file/:year/:month', () => {
        it('should return file deatil', done => {
            request
                .get(`/file/${now.getFullYear()}/${now.getMonth()}`)
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should ok');

                    let articles = result.res.body;
                    assert.isArray(articles, 'articles should be a array');
                    assert.lengthOf(articles, 1, 'articles has length of 1');

                    for (let article of articles) {
                        assert.isObject(article, 'article is an object');
                        assert.propertyVal(article, 'title', testArticleContent.title);
                        assert.propertyVal(article, 'url', testArticleContent.url);
                        assert.propertyVal(article, 'content', testArticleContent.content);
                    }
                    done();
                });
        });
    });
});