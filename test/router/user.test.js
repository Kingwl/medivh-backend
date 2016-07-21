const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const agent = require('supertest-koa-agent');
const app = require('../../src/app.js');
const request = agent(app);
const assert = require('chai').assert;

const Article = require('../../src/model/article');
const User = require('../../src/model/user');

describe('test/router/user.test.js', () => {
    const testUserData = {
        name: 'testName',
        encrypted_password: 'testPass',
        male: 0,
        age: 1
    };
    const newUserData = {
        name: 'newName',
        encrypted_password: 'newPass',
        male: 0,
        age: 1
    };
    let testUser = null;

    beforeEach(function* () {
        testUser = new User(testUserData);
        yield testUser.save();
    });

    afterEach(function* () {
        yield testUser.remove();
    })

    describe('GET /user', () => {
        it('it should return array of users', done => {
            request
                .get('/user')
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let users = result.res.body;
                    assert.isArray(users, 'users is an array');
                    assert.lengthOf(users, 1, 'users has length of 1');

                    for (let user of users) {
                        assert.isObject(user, 'user is an object');
                        assert.propertyVal(user, 'name', testUserData.name);
                        assert.propertyVal(user, 'encrypted_password', testUserData.encrypted_password);
                        assert.propertyVal(user, 'male', testUserData.male);
                        assert.propertyVal(user, 'age', testUserData.age);
                    }
                    done();
                })
        });
    });

    describe('POST /user', () => {
        afterEach(function* () {
            yield User.remove(newUserData);
        });

        it('shoule return created user', done => {
            request
                .post('/user')
                .send(newUserData)
                .expect(201)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let user = result.res.body;
                    assert.isObject(user, 'user is an object');
                    assert.propertyVal(user, 'name', newUserData.name);
                    assert.propertyVal(user, 'encrypted_password', newUserData.encrypted_password);
                    assert.propertyVal(user, 'male', newUserData.male);
                    assert.propertyVal(user, 'age', newUserData.age);
                    done();
                });
        });
    });

    describe('GET /user/:id', () => {
        it('should return existed user object', done => {
            request
                .get(`/user/${testUser._id}`)
                .expect(200)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let user = result.res.body;
                    assert.isObject(user, 'user is an object');
                    assert.propertyVal(user, 'name', testUserData.name);
                    assert.propertyVal(user, 'encrypted_password', testUserData.encrypted_password);
                    assert.propertyVal(user, 'male', testUserData.male);
                    assert.propertyVal(user, 'age', testUserData.age);
                    done();
                });
        });
    });

    describe('PUT /user/:id', () => {
        it('should return of updated user object', done => {
            request
                .put(`/user/${testUser._id}`)
                .send(newUserData)
                .expect(201)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');

                    let user = result.res.body;
                    assert.isObject(user, 'user is an object');
                    assert.propertyVal(user, 'name', newUserData.name);
                    assert.propertyVal(user, 'encrypted_password', newUserData.encrypted_password);
                    assert.propertyVal(user, 'male', newUserData.male);
                    assert.propertyVal(user, 'age', newUserData.age);
                    done();
                });
        });
    });

    describe('DELETE /user/:id', () => {
        it('shoule return empty document', done => {
            request
                .delete(`/user/${testUser._id}`)
                .expect(204)
                .end((err, result) => {
                    assert.isOk(result, 'result should be ok');
                    assert.isUndefined(result.res.body, 'body should undefined');
                    done();
                });
        });
    });
});