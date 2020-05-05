'use strict';

const supergoose = require('@code-fellows/supergoose');

const Model = require('../lib/models/model.js');
const usersSchema = require('../lib/models/users-schema.js');

const UsersModel = new Model(usersSchema);

beforeAll(async () => {
  await UsersModel.create({
    "username":"Quill",
    "password":"ILoveGamora"
  });

  await UsersModel.create({
    "username":"Groot",
    "password":"IAmGroot"
  });
});

describe('Testin UsersModel CRUD operations', () => {
  it('can create users', async () => {
    let user = await UsersModel.create({
      "username":"Thor",
      "password":"StrongestAvenger"  
    });
    
    expect(user.username).toStrictEqual('Thor');
    expect(user.role).toStrictEqual('user');
  });

  it('can read all users', async () => {
    let users = await UsersModel.read();


    expect(users.length).toStrictEqual(3);
    expect(users[0].username).toStrictEqual('Quill');
    expect(users[1].username).toStrictEqual('Groot');
    expect(users[2].username).toStrictEqual('Thor');
  });

  it('can update a user', async () => {
    let user = await UsersModel.readByQuery({'username':'Thor'});

    console.log('user:', user[0]._id);

    let newRecord = {
      'username': 'FatThor',
      'paassword': 'Lebowski'
    }

    let updatedUser = await UsersModel.update(user[0]._id, newRecord);
    console.log('updatedUser:', updatedUser);

    expect(updatedUser.username).toStrictEqual('FatThor');
  });

  it('can delete a user', async () => {
    let user = await UsersModel.readByQuery({'username':'Groot'});

    let userID = user[0]._id;

    let deletedID = await UsersModel.delete(userID);

    expect(deletedID).toStrictEqual(userID);
  });

});