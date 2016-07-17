'use strict'

const router = require('koa-router')();
const bluebird = require('bluebird');

function register (app) {


    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;