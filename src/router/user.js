'use strict'

const router = require('koa-router')();
const mongoose = require('mongoose');
const User = require('../model/user');

function register(app) {
    router.get('/user', function* (next) {
        let users = yield User.find();
        this.end({
            status: 200,
            data: users
        })
    });

    router.post('/user', function* (next) {
        let {name, encrypted_password, male, age} = this.request.body;
        this.assert(name && encrypted_password, 422, 'params is not valid');
        this.assert(typeof male !== 'undefined' && typeof age !== 'undefined', 422, 'params is not valid');

        let oldUser = yield User.findOne({ name });
        this.assert(!oldUser, 422, `user ${name} is existed`);

        let newUser = new User({
            name,
            encrypted_password,
            male,
            age
        });

        yield newUser.save();

        this.end({
            status: 201,
            data: newUser
        });
    });

    router.get('/user/:id', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(uid), 404, 'id is invalid');

        let user = yield User.findById(id);
        this.assert(user, 404, 'user is not existed');

        this.end({
            status: 200,
            data: user
        });
    });

    router.put('/user/:id', function* (next) {
        let {id} = this.params;
        let {name, encrypted_password, male, age} = this.request.body;
        this.assert(mongoose.Types.ObjectId.isValid(uid), 404, 'id is invalid');
        this.assert(name && encrypted_password, 422, 'params is not valid');
        this.assert(typeof male !== 'undefined' && typeof age !== 'undefined', 422, 'params is not valid');

        let user = yield User.findById(id);
        this.assert(user, 404, 'user is not existed');

        user = Object.assign(user, { name, encrypted_password, male, age });
        yield user.save();

        this.end({
            status: 201,
            data: user
        })
    });

    router.delete('/user/:id', function* (next) {
        let {id} = this.params;
        this.assert(mongoose.Types.ObjectId.isValid(uid), 404, 'id is invalid');

        let user = yield User.findById(id);
        this.assert(user, 404, 'user is not existed');

        this.end({
            status: 204,
            data: {}
        });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;