'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');
const Article = require('../model/article');

function register(app) {
    router.get('/article', function* (next) {
        let articles = yield Article.find();
        this.body = articles;
    });

    router.post('/article', function* (next) {
        let params = this.request.body;
        let newArticle = new Article({
            title: params.title || '',
            url: params.url || '',
            content: params.content || '',
        });
        yield newArticle.save();
        this.body = newArticle;
    });

    router.get('/article/:id', function* (next) {

    });

    router.put('/article/:id', function* (next) {

    });

    router.delete('/article/:id', function* (next) {

    });

    router.get('/article/:id/reply', function* (next) {

    });

    router.post('/article/:id/reply', function* (next) {

    });

    router.get('/article/:id/tag', function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;