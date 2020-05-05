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

  await UsersModel.create({
    "username": "AllyAdmin",
    "password": "password",
    "role": "admin"
  });

  await UsersModel.create({
    "username": "EddyEdit",
    "password": "password",
    "role": "editor"
  });
});


const mockRequest = supergoose(app.server);

describe('testing GET /users endpoint', () => {
  it('returns all users', async () => {
    let response = await mockRequest.get('/users');

    expect(response.status).toStrictEqual(200);
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

describe('access control endpoints', () => {
  it('GET /public', async () => {
    let response = await mockRequest.get('/public');
  
    expect(response.text).toStrictEqual('Public page everyone can see');
  });

  it('GET /private', async () => {
    let userData = await mockRequest.post('/signin').auth('Jack:testing123');
    let token = userData.body.token;

    let response = await mockRequest.get('/private').set('Authorization', `Bearer ${token}`);

    expect(response.text).toStrictEqual('Logged in, can view content.');
  });

  it('GET /readonly: user', async () => {
    let userData = await mockRequest.post('/signin').auth('Jack:testing123');
    let token = userData.body.token;

    let response = await mockRequest.get('/readonly').set('Authorization', `Bearer ${token}`);

    expect(response.text).toStrictEqual('You have read access');

  });

  it('GET /readonly: editor', async () => {
    let userData = await mockRequest.post('/signin').auth('EddyEdit:password');
    let token = userData.body.token;

    let response = await mockRequest.get('/readonly').set('Authorization', `Bearer ${token}`);

    expect(response.text).toStrictEqual('You have read access');

  });

  it('GET /readonly: admin', async () => {
    let userData = await mockRequest.post('/signin').auth('AllyAdmin:password');
    let token = userData.body.token;

    let response = await mockRequest.get('/readonly').set('Authorization', `Bearer ${token}`);

    expect(response.text).toStrictEqual('You have read access');

  });

  // -- POST /create

  it('POST /create: user', async () => {
    let userData = await mockRequest.post('/signin').auth('Jack:testing123');
    let token = userData.body.token;

    let response = await mockRequest.post('/create').set('Authorization', `Bearer ${token}`);
    expect(response.body.message).toStrictEqual('No access');
  });

  it('POST /create: editor', async () => {
    let userData = await mockRequest.post('/signin').auth('EddyEdit:password');
    let token = userData.body.token;

    let response = await mockRequest.post('/create').set('Authorization', `Bearer ${token}`);
    expect(response.body.message).toStrictEqual('No access');
  });

  it('POST /create: admin', async () => {
    let userData = await mockRequest.post('/signin').auth('AllyAdmin:password');
    let token = userData.body.token;

    let response = await mockRequest.post('/create').set('Authorization', `Bearer ${token}`);
    expect(response.text).toStrictEqual('You have create access');
  });

  // -- PUT /update

  it('PUT /update: user', async () => {
    let userData = await mockRequest.post('/signin').auth('Jack:testing123');
    let token = userData.body.token;

    let response = await mockRequest.put('/update').set('Authorization', `Bearer ${token}`);
    expect(response.body.message).toStrictEqual('No access');
  });

  it('PUT /update: editor', async () => {
    let userData = await mockRequest.post('/signin').auth('EddyEdit:password');
    let token = userData.body.token;

    let response = await mockRequest.put('/update').set('Authorization', `Bearer ${token}`);
    expect(response.text).toStrictEqual('You have update access');
  });

  it('PUT /update: admin', async () => {
    let userData = await mockRequest.post('/signin').auth('AllyAdmin:password');
    let token = userData.body.token;

    let response = await mockRequest.put('/update').set('Authorization', `Bearer ${token}`);
    expect(response.text).toStrictEqual('You have update access');
  });

  // -- DELETE /delete

  it('DELETE /delete: user', async () => {
    let userData = await mockRequest.post('/signin').auth('Jack:testing123');
    let token = userData.body.token;

    let response = await mockRequest.delete('/delete').set('Authorization', `Bearer ${token}`);
    expect(response.body.message).toStrictEqual('No access');
  });

  it('DELETE /delete: editor', async () => {
    let userData = await mockRequest.post('/signin').auth('EddyEdit:password');
    let token = userData.body.token;

    let response = await mockRequest.delete('/delete').set('Authorization', `Bearer ${token}`);
    expect(response.body.message).toStrictEqual('No access');
  });

  it('DELETE /delete: admin', async () => {
    let userData = await mockRequest.post('/signin').auth('AllyAdmin:password');
    let token = userData.body.token;

    let response = await mockRequest.delete('/delete').set('Authorization', `Bearer ${token}`);
    expect(response.text).toStrictEqual('You have delete access');
  });

});

