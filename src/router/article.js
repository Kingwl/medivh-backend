'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');
const Article = require('../model/article');

function register (app) {
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
            reply: [],
            isDelete: false,
            readCount: 0,
            createTime: Date.now(),
            updateTime: Date.now(),
        });
        yield newArticle.save();
        this.body = newArticle;
    });


    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;