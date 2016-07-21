'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const Tag = require('../model/tag');
const Article = require('../model/article');

function register(app) {
    router.get('/tag', function* (next) {
        let tags = yield Tag.find();
        this.end({
            status: 200,
            data: tags
        });
    });

    router.post('/tag', function* (next) {
        let {name} = this.request.body;
        this.assert(name, 422, 'invalid name');

        let newTag = new Tag({ name });
        yield newTag.save();

        this.end({
            status: 201,
            data: newTag
        });
    });

    router.get('/tag/:id', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(id), 404, 'id is invalid');

        let tag = yield Tag.findById(id).populate('articles');
        this.assert(tag, 404, `tag ${id} is not existed`);

        this.end({
            status: 200,
            data: tag
        })
    });

    router.delete('/tag/:id', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(id), 404, 'id is invalid');

        let tag = yield Tag.findById(id);
        this.assert(tag, 404, `tag ${id} is not existed`);

        yield tag.remove();

        this.end({
            status: 204,
            data: {}
        })
    });

    router.get('/tag/:id/article', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(id), 404, 'id is invalid');

        let tag = yield Tag.findById(id).populate('article');
        this.assert(tag, 404, `tag ${id} is not existed`);

        this.end({
            status: 200,
            data: tag.article
        })
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;