'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const User = require('../model/user');

function register(app) {
    router.get('/user', function* (next) {
        let users = yield User.find();
        this.body = users;
    });

    router.post('/user', function* (next) {
        let {name, encrypted_password, male, age} = this.request.body;
        let oldUser = yield User.find({ name });
        if (!oldUser) {
            let newUser = new User({
                name,
                encrypted_password,
                male,
                age
            });

            yield newUser.save();
            this.body = newUser;
        } else {
            this.body = { error: 'user was existed' };
        }
    });

    router.get('/user/:id', function* (next) {
        let {id} = this.params;
        let user = yield User.findById(id);
        this.body = user;
    });

    router.put('/user/:id', function* (next) {
        let {id} = this.params;
        yield User.findByIdAndUpdate(id, this.request.body);
        let newUser = yield User.findById(id);
        this.body = newUser;
    });

    router.delete('/user/:id', function* (next) {
        let {id} = this.params;
        yield User.findByIdAndRemove(id);
        this.body = {};
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;