'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const Tag = require('../model/tag');

function register(app) {
    router.get('/tag', function* (next) {
        let tags = yield Tag.find();
        this.body = tags;
    });

    router.post('/tag', function* (next) {
        let {name} = this.request.body;
        let newTag = new Tag({ name, article: [] });
        yield newTag.save();
        this.body = newTag;
    });

    router.get('/tag/:id', function* (next) {
        let {id} = this.params;
        let tag = yield Tag.findById(id);
        this.body = tag;
    });

    router.delete('/tag/:id', function* (next) {
        let {id} = this.params;
        let tag = yield Tag.findByIdAndRemove(id);
        this.body = {};
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;