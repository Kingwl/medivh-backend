'use strict'

const router = require('koa-router')();

function register(app) {
    router.get('/auth', /* istanbul ignore next */ function* (next) {

    });

    router.post('/auth', /* istanbul ignore next */ function* (next) {

    });

    router.delete('/auth', /* istanbul ignore next */ function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;