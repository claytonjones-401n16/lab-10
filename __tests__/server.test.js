'use strict';

const supergoose = require('@code-fellows/supergoose');
const app = require('../lib/server.js');

const Model = require('../lib/models/model.js');
const usersSchema = require('../lib/models/users-schema.js');

const UsersModel = new Model(usersSchema);

beforeAll(async () => {
  await UsersModel.create({
    "username": "Jack",
    "password": "testing123"
  });

  await UsersModel.create({
    "username": "Jill",
    "password": "jillPass"
  });

});


const mockRequest = supergoose(app.server);

describe('testing GET /users endpoint', () => {
  it('returns all users', async () => {
    let response = await mockRequest.get('/users');

    expect(response.status).toStrictEqual(200);
    expect(response.body.length).toStrictEqual(2);
    expect(response.body[0].username).toStrictEqual('Jack');
  });
});

describe('testing POST /singup endpoint', () => {
  it('correctly adds unique user', async () => {
    let response = await mockRequest.post('/signup').send({"username":"JimmyNeutron", "password":"NaCl"});

    expect(response.status).toStrictEqual(200);
    expect(response.body.user.username).toStrictEqual('JimmyNeutron');
  });

  it('denies duplicate username', async () => {
    let response = await mockRequest.post('/signup').send({"username":"Jack", "password":"Password"});
    expect(response.status).toStrictEqual(400);
    expect(response.body.message).toStrictEqual('Username already exists.');
  });
});

describe('testing POST /signin endpoint', () => {
  it('correctly signs in existing user with correct info', async () => {
    let response = await mockRequest.post('/signin').auth('Jack:testing123');

    expect(response.body.user.username).toStrictEqual('Jack');
    expect(response.body.token).toBeTruthy();
  });

  it('denies signin with invalid username', async () => {
    let response = await mockRequest.post('/signin').auth('Thor:StrongestAvenger');

    expect(response.status).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('Invalid Credentials');
  });

  it('denies signin with invalid password', async () => {
    let response = await mockRequest.post('/signin').auth('Jack:JacksPassword');

    expect(response.status).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('Invalid Credentials');
  });
});

describe('testing 404 route', () => {
  it('should say resource not found', async () => {
    let response = await mockRequest.get('/groot');

    console.log(response.status);

    expect(response.status).toStrictEqual(404);
    expect(response.text).toStrictEqual('Resource not found');
  });
});

describe('testing GET /user endpoint', () => {
  it('authorizes users via token', async () => {
    let userData = await mockRequest.post('/signin').auth('Jack:testing123');
    let token = userData.body.token;
  
    let response = await mockRequest.get('/user').set('Authorization', `Bearer ${token}`);
  
    expect(response.body.user).toStrictEqual('Jack');
  });
});