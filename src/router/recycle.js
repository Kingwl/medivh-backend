'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const Article = require('../model/article');
const User = require('../model/user');
const Tag = require('../model/tag');

function register(app) {
    router.get('/recycle', function* (next) {
        let articles = yield Article.find({ isDelete: true });
        this.body = articles;
    });

    router.get('/recycle/:uid', function* (next) {
        let {uid} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(uid), 404, 'uid is invalid');

        let user = yield User.findById(uid).populate('articles');
        this.assert(user, 404, `user ${uid} is not existed`);

        this.end({
            state: 200,
            data: user.articles.filter(x => x.isDelete)
        });
    });

    router.delete('/recycle/:uid', function* (next) {
        let {uid} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(uid), 404, 'uid is invalid');

        let user = yield User.findById(uid).populate({
            path: 'articles',
            populate: {
                path: 'tag',
            }
        });
        this.assert(user, 404, `user ${uid} is not existed`);

        let deletedArticle = user.articles.filter(x => x.isDelete);
        user.articles = user.articles.filter(x => !x.isDelete);

        for (let art of deletedArticle) {
            yield art.tag.map(tag => {
                tag.article.splice(tag.article.findIndex(x => x == art._id));
                return tag.save();
            });

            yield art.remove();
        };
        yield user.save();

        this.end({
            state: 204,
            data: {}
        });
    });

    router.post('/recycle/:uid/remove/:id', function* (next) {
        let {uid, id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(uid) && mongoose.Types.ObjectId.isValid(id), 404, 'uid or id is invalid');

        let user = yield User.findById(uid).populate({
            path: 'articles ',
            populate: {
                path: 'tag'
            }
        });
        this.assert(user, 404, `user ${uid} is not existed`);

        let idx = user.articles.findIndex(x => x._id == id && x.isDelete);
        this.assert(idx !== -1, 404, `article ${id} not found`);

        let article = user.articles[idx];
        user.articles.splice(idx);

        yield article.tag.map(tag => {
            tag.article.splice(tag.article.findIndex(x => x == id));
            return tag.save();
        });

        yield article.remove();
        yield user.save();

        this.end({
            state: 204,
            data: {}
        });
    });

    router.post('/recycle/:uid/recovery/:id', function* (next) {
        let {uid, id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(uid) && mongoose.Types.ObjectId.isValid(id), 400, 'uid or id is invalid');

        let user = yield User.findById(uid).populate({ path: 'articles' });
        let article = user.articles.find(x => x._id == id && x.isDelete);
        this.assert(article, 404, `article ${id} not found`);

        article.isDelete = false;
        yield article.save();

        this.end({
            state: 201,
            data: article
        });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;