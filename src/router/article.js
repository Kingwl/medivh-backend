'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');
const Article = bluebird.promisifyAll(require('../model/article.js'), { suffix: 'Promise' });

function register (app) {
    router.get('/article', function* (next) {
        let articles = yield Article.findPromise();
        this.body = articles;
    });

    router.post('/article', function* (next) {
        let params = this.request.query;
        let newArticle = new Article({
            title: params.title || '',
            url: params.url || '',
            content: params.content || '',
            reply: [],
            isDelete: false,
            readCount: 0,
            createTime: Date.now(),
            updateTime: Date.now(),
        });
        yield bluebird.promisify(newArticle.save)();
        this.body = newArticle;
    });


    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;