'use strict'

const router = require('koa-router')();
const Article = require('../model/article');
const User = require('../model/user');

function register(app) {
    router.get('/recycle', function* (next) {
        let articles = yield Article.find({ isDelete: true });
        this.body = articles;
    });

    router.get('/recycle/:uid', function* (next) {
        let {uid} = this.params;
        let user = yield User.findById(uid);
        let articles = yield user.articles.map(id => Article.findById(id));
        this.body = articles;
    });

    router.delete('/recycle/:uid', function* (next) {
        let {uid} = this.params;
        let user = yield User.findById(uid);
        user.articles = (yield user.articles.map(id => Article.findByIdAndRemove(id))).filter(x => !x.isDelete).map(x => x._id);
        yield user.save();
        this.body = {};
    });

    router.post('/recycle/:uid/remove/:id', function* (next) {
        // TODO article valid
        let {uid, id} = this.params;
        let user = yield User.findById(uid);
        let article = yield Article.findByIdAndRemove(id);
        user.articles = user.articles.filter(xid => xid != id);
        yield user.save();
        this.body = {};
    });

    router.post('/recycle/:uid/recovery/:id', function* (next) {
        let {uid, id} = this.params;
        let article = yield Article.findById(id);
        yield article.save();
        this.body = article;
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;