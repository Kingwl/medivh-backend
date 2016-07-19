'use strict'

const router = require('koa-router')();
const Article = require('../model/article');

function register(app) {
    router.get('/file', function* (next) {
        let articles = yield Article.find();
        let option = {
            map: function () {
                emit(`${this.createTime.getFullYear()}-${this.createTime.getMonth()}`, 1);
            },

            recude: function (k, values) {
                return values.length;
            }
        };

        let files = yield Article.mapReduce(option);
        this.body = files;
    });

    router.get('/file/date/:year/:month', function* (next) {
        let {year, month} = this.params;
        
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;