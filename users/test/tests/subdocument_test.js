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

test.beforeEach('drop test tables', mongooseDropTestCollections);

test.serial('Creating subdocuments', async (t) => {
  const joe = new User({
    name: 'Joe',
    posts: [{ title: 'post_title' }],
  });
  await joe.save();
  const queriedUser = await User.findOne({ name: 'Joe' });
  t.is( queriedUser.posts[0].title, 'post_title', 'queriedUser was created with a post subdocument' );
});

test.serial('Adding subdocuments to existing record', async (t) => {
  const joe = new User({
    name: 'Joe',
    posts: [],
  });
  await joe.save();
  const queriedUser = await User.findOne({ name: 'Joe' });
  queriedUser.posts.push({ title: 'New Post' });
  await queriedUser.save();
  const queriedUserUpdated = await User.findOne({ name: 'Joe' });
  t.is(queriedUserUpdated.posts[0].title, 'New Post', 'queriedUser was updated with an added post');
});

test.serial('Removing subdocuments from existing record', async (t) => {
  const joe = new User({
    name: 'Joe',
    posts: [{ title: 'New Title' }],
  });
  await joe.save();
  const queriedUser = await User.findOne({ name: 'Joe' });
  const postToRemove = queriedUser.posts[0];
  postToRemove.remove();
  await queriedUser.save();
  const queriedUserUpdated = await User.findOne({ name: 'Joe' });
  console.log('queriedUserUpdated');
  console.log(queriedUserUpdated);
  t.is(queriedUserUpdated.posts.length, 0, 'queriedUser was updated with a removed post');
});








