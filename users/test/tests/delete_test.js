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
  });
  return user_1.save();
}

test.before('connect to database', async (t) => {
  await mongooseConnect('users_test');
});

test.after.always('disconnect from database', async () => {
  await mongooseDisconnect();
});

test.beforeEach('drop test tables', mongooseDropTestCollections);

test.serial('model instance `remove`', async (t) => {
  const newUser = await createUser();
  await newUser.remove();
  const queriedUser = await User.findOne({ name: 'newUser' });
  t.is( queriedUser, null, 'user should be null after deleting it' );
});

test.serial('class method `remove`', async (t) => {
  const newUser = await createUser();
  await User.remove({ name: 'newUser' });
  const queriedUser = await User.findOne({ name: 'newUser' })
  t.is( queriedUser, null, 'user should be null after deleting it' );
});

test.serial('class method `findOneAndRemove`', async (t) => {
  const newUser = await createUser();
  await User.findOneAndRemove({ name: 'newUser' });
  const queriedUser = await User.findOne({ name: 'newUser' })
  t.is( queriedUser, null, 'user should be null after deleting it' );
});

test.serial('class method `findByIdAndRemove`', async (t) => {
  const newUser = await createUser();
  await User.findByIdAndRemove(newUser._id);
  const queriedUser = await User.findOne({ name: 'newUser' })
  t.is( queriedUser, null, 'user should be null after deleting it' );
});
