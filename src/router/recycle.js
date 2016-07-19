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
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return this.end({
                status: 400,
                data: 'uid is not valid',
            });
        }

        let user = yield User.findById(uid).populate({ path: 'articles' });
        if (!user) {
            return this.end({
                status: 400,
                data: `user ${uid} is not existed`,
            });
        }

        let articles = user.articles.filter(x => x.isDelete);
        this.body = articles;
    });

    router.delete('/recycle/:uid', function* (next) {
        let {uid} = this.params;
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            return this.end({
                status: 400,
                data: 'uid is not valid',
            });
        }

        let user = yield User.findById(uid).populate({
            path: 'articles',
            populate: {
                path: 'tag',
            }
        });

        if (!user) {
            return this.end({
                status: 400,
                data: `user ${uid} is not existed`,
            });
        }

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

        this.body = {};
    });

    router.post('/recycle/:uid/remove/:id', function* (next) {
        let {uid, id} = this.params;
        if (!mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(id)) {
            return this.end({
                status: 400,
                data: 'uid or id is not valid',
            });
        }

        let user = yield User.findById(uid).populate({
            path: 'articles ',
            populate: {
                path: 'tag'
            }
        });

        let idx = user.articles.findIndex(x => x._id == id && x.isDelete);
        if (idx === -1) {
            return this.end({
                status: 400,
                data: `article ${id} not found`,
            });
        }

        let article = user.articles[idx];
        user.articles.splice(idx);

        yield article.tag.map(tag => {
            tag.article.splice(tag.article.findIndex(x => x == id));
            return tag.save();
        });

        yield article.remove();
        yield user.save();

        this.body = {};
    });

    router.post('/recycle/:uid/recovery/:id', function* (next) {
        let {uid, id} = this.params;
        let user = yield User.findById(uid).populate({ path: 'articles' });
        let article = user.articles.find(x => x._id == id && x.isDelete);
        if (article) {
            article.isDelete = false;
            yield article.save();
        }
        this.body = article;
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;