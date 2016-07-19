'use strict'

let env = process.env.NODE_ENV;
if (env === 'development') {
    require('node-monkey').start({ host: "127.0.0.1", port:"50500" });
} 

const fs = require('fs');
const config = require('../config/config.js');
const mongoose = require('mongoose');

const koa = require('koa');
const json = require('koa-json');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const end = require('./util/response.js');
const app = koa();

// use native Promise
mongoose.Promise = global.Promise;

// connect database
mongoose.connect(env !== 'test' ? config.database : config.testDatabase, err => {
    if (err) {
        console.log('connect database error -->', err);
        process.exit(10601);
    }
    console.log('connect database success');
});

// provide this.end() function
app.use(end);

// support request log
app.use(logger());

// error handle
app.use(function* (next) {
    try {
        yield next;
    }
    catch (err) {
        let message = err.message;

        if (message === 'invalid json data') {
            return this.end({
                status: 400,
                data: message,
            });
        }

        console.log('error --> ', message);
        process.exit(1);
    }
})

// support json type response
app.use(json());

// support body data
app.use(bodyParser({
    onerror: function (err, ctx) {
        ctx.throw('invalid json data');
    }
}));

// import all routers
fs.readdir(__dirname + '/router', (err, result) => {
    if (err) {
        console.log('require routers error --> ', err);
        return;
    }
    
    for (let file of result) {
        require(`./router/${ file }`)(app);
    }
});

// static file
app.use(require('koa-static')('view/'));

// start listener
app.listen(config.port, () => {
    console.log('start server at http://localhost:' + config.port);
});

// other error handle
app.on('error', err => {
    console.log('error --> ', err.message);
    process.exit(1);
});


module.exports = app;