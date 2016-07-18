'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');

function register(app) {
    router.get('/reply', function* (next) {

    });

    router.get('/reply/:id', function* (next) {

    });

    router.put('/reply/:id', function* (next) {

    });

    router.delete('/reply/:id', function* (next) {

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;