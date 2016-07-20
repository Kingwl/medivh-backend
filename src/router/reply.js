'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const Reply = require('../model/reply');

function register(app) {
    router.get('/reply', function* (next) {
        let replys = yield Reply.find();

        this.end({
            state: 200,
            data: replys
        })
    });

    router.get('/reply/:id', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(id), 404, 'id is invalid');

        let reply = yield Reply.findById(id);
        this.assert(reply, 404, 'reply not found');

        this.end({
            state: 200,
            data: body
        });
    });

    router.put('/reply/:id', function* (next) {
        let {id} = this.params;
        let {name, content} = this.request.body;
        this.assert(mongoose.Types.ObjectId.isValid(id), 404, 'id is invalid');
        this.assert(name && content, 404, 'invalid params');

        let reply = yield Reply.findById(id);
        reply = Object.assing(reply, { name, content });

        yield reply.save();

        this.end({
            state: 201,
            data: reply
        });
    });

    router.delete('/reply/:id', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(id), 404, 'id is invalid');

        let reply = yield Reply.findById(id);
        this.assert(reply, 404, 'reply not found');

        reply.remove();

        this.end({
            state: 204,
            data: {}
        });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;