const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;
const Article = require('../../src/model/article');
const Tag = require('../../src/model/tag');
const Reply = require('../../src/model/reply');

describe('test/router/article.test.js', () => {
    describe('GET /article', () => {
        it('should return array of articles, and array length equal 0', done => {
            request.get('/article').end((err, result) => {
                let data = result.res.body;
                assert.equal(200, result.status, 'response status code should be 200');
                assert.isArray(data, 'response data should be array');
                assert.equal(0, data.length, 'article length should equal 0');
                done();
            });
        });
    });

    describe('GET /article/full', () => {
        it('should return array of articles (populate reply and tag), and array length equal 0', done => {
            request.get('/article/full').end((err, result) => {
                let data = result.res.body;
                assert.equal(200, result.status, 'response status code should be 200');
                assert.isArray(data, 'response data should be array');
                assert.equal(0, data.length, 'article length should equal 0');
                done();
            });
        });
    });

    describe('GET /article/:id', () => {
        let article = null;

        before(done => {
            article = new Article();
            article.save();
            done();
        });

        it('should return article witch id equal given', done => {
            request.get('/article/' + article._id).end((err, result) => {
                let data = result.res.body;
                assert.equal(200, result.status, 'response status code should be 200');
                assert.isObject(data, 'response data should be object');
                done();
            });
        });

        it('should return 404 response status code', done => {
            request.get('/article/579044117387a7c688888888').end((err, result) => {
                assert.equal(404, result.status, 'response status code should be 404');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                done();
            });
        });
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
                    assert.equal(201, result.status, 'response status code should be 201');
                    assert.isObject(data, 'response data should be object');
                    assert.equal('aaa', data.title, 'article.title should equal "aaa"');
                    assert.equal('bbb', data.url, 'article.url should equal "bbb"');
                    assert.equal('ccc', data.content, 'article.content should equal "ccc"');
                    done();
                });
        });

        after(done => {
            Article.remove({}, () => {
                done();
            });
        });
    });

    describe('PUT /article/:id', () => {
        let article = null;

        before(done => {
            article = new Article({
                title: 'aaa',
                url: 'bbb',
                content: 'ccc',
            });
            article.save();
            done();
        });

        it('should return updated article', done => {
            request.put('/article/' + article._id).send({ title: '1', url: '2', content: '3' }).end((err, result) => {
                let data = result.res.body;
                assert.equal(201, result.status, 'response status code should be 201');
                assert.isObject(data, 'response data should be object');
                assert.equal('1', data.title, 'article.title should equal "1"');
                assert.equal('2', data.url, 'article.url should equal "2"');
                assert.equal('3', data.content, 'article.content should equal "3"');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                done();
            });
        });
    });

    describe('DELETE /article/:id', () => {
        let article = null;

        before(done => {
            article = new Article();
            article.save();
            done();
        });

        it('should return 204 response status code', done => {
            request.delete('/article/' + article._id).end((err, result) => {
                assert.equal(204, result.status, 'response status code should be 204');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                done();
            });
        });
    });

    describe('GET /article/:id/reply', () => {
        let article = null;

        before(done => {
            article = new Article();
            article.save();
            done();
        });

        it('should return array of article\'s replys, and array length equal 0', done => {
            request.get(`/article/${article._id}/reply`).end((err, result) => {
                let data = result.res.body;
                assert.equal(200, result.status, 'response status code should be 200');
                assert.isArray(data, 'response data should be array');
                assert.equal(0, data.length, 'reply length should equal 0');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                done();
            });
        });
    });

    describe('POST /article/:id/reply', () => {
        let article = null;

        before(done => {
            article = new Article();
            article.save();
            done();
        });

        it('should return created reply', done => {
            request.post(`/article/${article._id}/reply`).send({ name: 'a', content: 'b', replyTo: 0 }).end((err, result) => {
                let data = result.res.body;
                assert.equal(201, result.status, 'response status code should be 201');
                assert.isObject(data, 'response data should be object');
                assert.equal('a', data.name, 'reply.name should equal "a"');
                assert.equal('b', data.content, 'reply.name should equal "b"');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                Reply.remove({ name: 'a', content: 'b', replyTo: 0 }, () => {
                    done();
                })
            });
        });
    });

    describe('GET /article/:id/tag', () => {
        let article = null;

        before(done => {
            article = new Article();
            article.save();
            done();
        });

        it('should return array of article\'s tag, and array length equal 0', done => {
            request.get(`/article/${article._id}/tag`).end((err, result) => {
                let data = result.res.body;
                assert.equal(200, result.status, 'response status code should be 200');
                assert.isArray(data, 'response data should be array');
                assert.equal(0, data.length, 'tag length should equal 0');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                done();
            });
        });
    });

    describe('POST /article/:id/tag', () => {
        let article = null;
        let tag = null;

        before(done => {
            article = new Article();
            article.save();
            tag = new Tag();
            tag.save();
            done();
        });

        it('should return created tag', done => {
            request.post(`/article/${article._id}/tag`).send({ tagId: tag._id }).end((err, result) => {
                let data = result.res.body;
                assert.equal(201, result.status, 'response status code should be 201');
                assert.isObject(data, 'response data should be object');
                assert.notEqual(undefined, data.tag.find(x => x._id.toString() === tag._id.toString()), `reply.tag should hava id "${tag._id}"`);
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                Tag.remove({}, () => {
                    done();
                })
            });
        });
    });

    describe('POST /article/:id/tag', () => {
        let article = null;
        let tag = null;

        before(done => {
            article = new Article();
            article.save();
            tag = new Tag();
            tag.save();
            done();
        });

        it('should return created tag', done => {
            request.post(`/article/${article._id}/tag`).send({ tagId: [tag._id] }).end((err, result) => {
                let data = result.res.body;
                assert.equal(201, result.status, 'response status code should be 201');
                assert.isObject(data, 'response data should be object');
                assert.notEqual(undefined, data.tag.find(x => x._id.toString() === tag._id.toString()), `reply.tag should hava id "${tag._id}"`);
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                Tag.remove({}, () => {
                    done();
                })
            });
        });
    });

    describe('DELETE /article/:id/tag', () => {
        let article = null;
        let tag = null;

        before(done => {
            article = new Article();
            article.save();
            tag = new Tag();
            tag.save();
            article.tag.push(tag._id);
            article.save();
            done();
        });

        it('should return 204 response status code', done => {
            request.delete(`/article/${article._id}/tag`).send({ tagId: tag._id }).end((err, result) => {
                assert.equal(204, result.status, 'response status code should be 204');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                Tag.remove({}, () => {
                    done();
                })
            });
        });
    });

    describe('DELETE /article/:id/tag', () => {
        let article = null;
        let tag1 = null;
        let tag2 = null;

        before(done => {
            article = new Article();
            article.save();
            tag1 = new Tag();
            tag1.save();
            tag2 = new Tag();
            tag2.save();
            article.tag.push(tag1._id);
            article.save();
            tag1.article = [];
            tag1.save();
            done();
        });

        it('should return 204 response status code', done => {
            request.delete(`/article/${article._id}/tag`).send({ tagId: [tag2._id] }).end((err, result) => {
                assert.equal(204, result.status, 'response status code should be 204');
                done();
            });
        });

        it('should return 204 response status code', done => {
            request.delete(`/article/${article._id}/tag`).send({ tagId: [tag1._id] }).end((err, result) => {
                assert.equal(204, result.status, 'response status code should be 204');
                done();
            });
        });

        after(done => {
            Article.remove({}, () => {
                Tag.remove({}, () => {
                    done();
                })
            });
        });
    });
});