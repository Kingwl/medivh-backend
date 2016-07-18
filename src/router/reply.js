'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const Reply = require('../model/reply');

function register(app) {
    router.get('/reply', function* (next) {
        let replys = yield Reply.find();
        this.body = replys;
    });

    router.get('/reply/:id', function* (next) {
        let {id} = this.params;
        let reply = yield Reply.findById(id);
        this.body = reply;
    });

    router.put('/reply/:id', function* (next) {
        let {id} = this.params;
        yield Reply.findByIdAndUpdate(id, this.request.body);
        let newReply = yield Reply.findById(id);
        this.body = newReply;
    });

    router.delete('/reply/:id', function* (next) {
        let {id} = this.params;
        yield Reply.findByIdAndRemove(id);
        this.body = {};
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;