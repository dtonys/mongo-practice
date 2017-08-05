import test from 'ava';
import mongoose from 'mongoose';
import {
  mongooseConnect,
  mongooseDisconnect,
  mongooseDropTestCollections,
} from '../test_helper';
import User from '../../src/user';


test.before('connect to database', async (t) => {
  await mongooseConnect('users_test');
});

test.after.always('disconnect from database', async () => {
  await mongooseDisconnect();
});

test.beforeEach('drop test tables, create users', async (t) => {
  await mongooseDropTestCollections();
  const alex = new User({ name: 'Alex' });
  const joe = new User({ name: 'Joe' });
  const maria = new User({ name: 'Maria' });
  const zach = new User({ name: 'Zach' });
  t.context.alex = alex;
  t.context.joe = joe;
  t.context.maria = maria;
  t.context.zach = zach;
  await Promise.all([
    zach.save(),
    alex.save(),
    joe.save(),
    maria.save(),
  ]);
});

test.serial('query user via `find`', async (t) => {
  const { joe } = t.context;
  const users = await User.find({ name: 'Joe' });

  t.is(
    users[0]._id.toString(),
    joe._id.toString(),
    'the id of the created object is same as the one queried'
  );

});

test.serial('query user via `findOne`', async (t) => {
  const { joe } = t.context;
  const user = await User.findOne({ _id: joe._id });
  t.is( user.name, 'Joe', 'Joe user should have the name Joe' )
});

test.serial('`skip` and `limit` the result set', async (t) => {
  const allUsers = await User.find({})
    .sort({ name: 1 })
    .skip(1)
    .limit(2);
  t.is(allUsers[0].name, 'Joe', 'the correct first user was found based on the `skip` and `sort` params');
  t.is(allUsers[1].name, 'Maria', 'the correct second user was found based on the `skip` and `sort` params');
  t.is(allUsers.length, 2, 'the number of results matches the `limit` param');
});

