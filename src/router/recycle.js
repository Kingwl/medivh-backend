'use strict'

const router = require('koa-router')();

function register(app) {
    router.get('/recycle', function* (next) {

    });

    router.post('/recycle/:method/:id', function* (next) {

    });

    router.delete('/recycle/:id', function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;