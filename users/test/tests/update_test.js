import test from 'ava';
import mongoose from 'mongoose';
import {
  mongooseConnect,
  mongooseDisconnect,
  mongooseDropTestCollections,
} from '../test_helper';
import User from '../../src/user';


function createUser() {
  const user_1 = new User({
    name: 'newUser',
    likes: 0,
  });
  return user_1.save();
}

async function assertName(t) {
  const allUsers = await User.find({});
  t.is(allUsers.length, 1, 'only one user exists in the database');
  t.is(allUsers[0].name, 'Alex', 'the user\'s name is the updated name');
  return true;
}

test.before('connect to database', async (t) => {
  await mongooseConnect('users_test');
});

test.after.always('disconnect from database', async () => {
  await mongooseDisconnect();
});

test.beforeEach('drop test tables', mongooseDropTestCollections);

test.serial('model instance `update`', async (t) => {
  const newUser = await createUser();
  await newUser.update({ name: 'Alex' });
  await assertName(t);
});

test.serial('model instance `set` and `save` ', async (t) => {
  const newUser = await createUser();
  newUser.set('name', 'Alex');
  await newUser.save();
  await assertName(t);
});

test.serial('model class `update` ', async (t) => {
  const newUser = await createUser();
  await User.update({ name: 'newUser' }, { name: 'Alex' });
  await assertName(t);
});

test.serial('model class `findOneAndUpdate` ', async (t) => {
  const newUser = await createUser();
  await User.findOneAndUpdate({ name: 'newUser' }, { name: 'Alex' });
  await assertName(t);
});

test.serial('model class `findByIdAndUpdate` ', async (t) => {
  const newUser = await createUser();
  await User.findByIdAndUpdate(newUser._id, { name: 'Alex' });
  await assertName(t);
});

test.serial('a user can have their postcount incremented by 1 ', async (t) => {
  const newUser = await createUser();
  await User.update({ name: 'newUser' }, { $inc: { likes: 10 } });
  const user = await User.findOne({ name: 'newUser' });
  t.is( user.likes, 10, 'likes was incremented by ten' );
});


