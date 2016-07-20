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


        this.end({
            status: 200,
            data: files
        });
    });

    router.get('/file/:year/:month', function* (next) {
        let {year, month} = this.params;
        this.assert(year, month, 404, 'invalid params');

        let file = yield Article.find({ $where: `this.createTime.getFullYear() == ${year} && this.createTime.getMonth() == ${month}` });
        console.log(file);

        this.end({
            status: 200,
            data: file
        });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;