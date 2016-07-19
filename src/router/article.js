'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');
const Article = require('../model/article');
const Reply = require('../model/reply');
const Tag = require('../model/tag');
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
            title: title,
            url: url,
            content: content,
        });
        yield newArticle.save();
        this.end({
            status: 201,
            data: newArticle,
        });
    });

    router.get('/article/:id', function* (next) {
        let id = this.params.id;
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

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
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        let article = yield Article.findById(id);
        this.assert(article, 404, 'article not exists');

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
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        let article = yield Article.findById(id);
        this.assert(article, 404, 'article not exists');

        article.isDelete = true;
        yield article.save();
        this.end({
            status: 204,
        }); 
    });

    router.get('/article/:id/reply', function* (next) {
        let id = this.params.id;
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        let article = yield Article.findById(id).populate('reply');
        this.assert(article, 404, 'article not exists');

        return this.end({
            status: 200,
            data: article.reply,
        });
    });

    router.post('/article/:id/reply', function* (next) {
        let { name, content, replyTo } = this.request.body;
        let id = this.params.id;
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        let article = yield Article.findById(id);
        this.assert(article, 404, 'article not exists');
        this.assert(replyTo >= 0 && replyTo <= article.reply.length, 400, 'invalid replyTo value');

        let reply = new Reply({
            name: name,
            content: content,
            index: article.reply.length + 1,
            replyTo: replyTo,
            article: article._id,
        });
        let newReply = yield reply.save();
        article.reply.push(newReply._id);
        yield article.save();

        return this.end({
            status: 201,
            data: newReply,
        });
    });

    router.get('/article/:id/tag', function* (next) {
        let id = this.params.id;
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        let article = yield Article.findById(id).populate('tag');
        this.assert(article, 404, 'article not exists');

        return this.end({
            status: 200,
            data: article.tag,
        });
    });

    router.post('/article/:id/tag', function* (next) {
        let id = this.params.id;
        let { tagId } = this.request.body;
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        if (!Array.isArray(tagId)) {
            tagId = [ tagId ];
        }

        let article = yield Article.findById(id);
        this.assert(article, 404, 'article not exists');

        for (let tId of tagId) {
            this.assert(mongoose.Types.ObjectId.isValid(tId), 400, `tagId ${tId} is invalid`);
            let tag = yield Tag.findById(tId);
            this.assert(tag, 404, `tag ${tId} not exists`);

            article.tag.push(tag._id);
            tag.article.push(article._id);
            yield tag.save();
        }
        yield article.save();

        return this.end({
            status: 201,
            data: yield Article.findById(id).populate('tag'),
        });
    });

    router.delete('/article/:id/tag', function* (next) {
        let id = this.params.id;
        let { tagId } = this.request.body;
        this.assert(mongoose.Types.ObjectId.isValid(id), 400, 'id is invalid');

        if (!Array.isArray(tagId)) {
            tagId = [ tagId ];
        }

        let article = yield Article.findById(id);
        this.assert(article, 404, 'article not exists');

        for (let tId of tagId) {
            this.assert(mongoose.Types.ObjectId.isValid(tId), 400, `tagId ${tId} is invalid`);
            let tag = yield Tag.findById(tId);
            this.assert(tag, 404, `tag ${tId} not exists`);

            let tagIndex = article.tag.indexOf(tag._id);
            if (tagIndex > -1) {
                article.tag.splice(tagIndex, 1);
            }
            let articleIndex = tag.article.indexOf(article._id);
            if (tagIndex > -1) {
                tag.article.splice(articleIndex, 1);
            }
            yield tag.save();
        }
        yield article.save();

        return this.end({
            status: 201,
            data: yield Article.findById(id).populate('tag'),
        });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;