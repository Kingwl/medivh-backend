'use strict'

const router = require('koa-router')();

function register(app) {
    router.get('/auth', function* (next) {

    });

    router.post('/auth', function* (next) {

    });

    router.delete('/auth', function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;