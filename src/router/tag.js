'use strict'

const router = require('koa-router')();

function register(app) {
    router.get('/tag', function* (next) {

    });

    router.post('/tag', function* (next) {

    });

    router.get('/tag/:id', function* (next) {

    });

    router.delete('/tag/:id', function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;