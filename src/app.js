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


// support json type response
app.use(json());

// support request log
app.use(logger());

// support body data
app.use(bodyParser());

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

// error handle
app.on('error', err => {
    console.log('error --> ', err);
    process.exit(1);
});

module.exports = app;