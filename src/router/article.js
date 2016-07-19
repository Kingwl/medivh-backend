'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');
const Article = require('../model/article');
const mongoose = require('mongoose');

function register(app) {
    router.get('/article', function* (next) {
        let articles = yield Article.find();
        this.end({ 
            status: 200,
            data: articles,
        });
    });

    router.post('/article', function* (next) {
        let { title, url, content } = this.request.body;
        let newArticle = new Article({
            title: title || '',
            url: url || '',
            content: content || '',
        });
        yield newArticle.save();
        this.end({
            status: 201,
            data: newArticle,
        });
    });

    router.get('/article/:id', function* (next) {
        let id = this.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return this.end({
                status: 400,
                data: 'id is not valid',
            });
        }

        let article = yield Article.findById(id);

        if (article) {
            article.readCount++;
            yield article.save();
            
            this.end({
                status: 200,
                data: article,
            });
        }
        else {
            this.end({
                status: 404,
                data: 'article not exists',
            });
        }
    });

    router.put('/article/:id', function* (next) {
        let { title, url, content } = this.request.body;
        let id = this.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return this.end({
                status: 400,
                data: 'id is not valid',
            });
        }

        let article = yield Article.findById(id);
        if (article === null) {
            return this.end({
                status: 404,
                data: 'article not exists',
            });
        }

        article.title = title || article.title;
        article.url = url || article.url;
        article.content = content || article.content;
        let updatedArticle = yield article.save();
        this.end({
            status: 201,
            data: updatedArticle,
        });
    });

    router.delete('/article/:id', function* (next) {
        let id = this.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return this.end({
                status: 400,
                data: 'id is not valid',
            });
        }

        let article = yield Article.findById(id);
        if (article === null) {
            return this.end({
                status: 404,
                data: 'article not exists',
            });
        }

        yield article.remove();
        this.end({
            status: 204,
        }); 
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