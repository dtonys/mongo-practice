import test from 'ava';
import mongoose from 'mongoose';
import {
  mongooseConnect,
  mongooseDisconnect,
} from '../test_helper';
import User from '../../src/user';


test.before('connect to database', async (t) => {
  await mongooseConnect('users_test');
});

test.after.always('disconnect from database', async () => {
  await mongooseDisconnect();
});

test.serial('postCount returns number of posts', async (t) => {
  const joe = new User({
    name: 'joe',
    posts: [{ title: 'PostTitle' }],
  });
  await joe.save();
  const queriedUser = await User.findOne({ name: 'joe' });
  t.is(queriedUser.postCount, 1, 'user postCount virtual should compute number of posts');
});
