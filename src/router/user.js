'use strict'

const router = require('koa-router')();

function register(app) {
    router.get('/user', function* (next) {

    });

    router.post('/user', function* (next) {

    });

    router.get('/user/:id', function* (next) {

    });

    router.put('/user/:id', function* (next) {

    });

    router.delete('/user/:id', function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;