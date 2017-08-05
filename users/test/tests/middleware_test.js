import test from 'ava';
import mongoose from 'mongoose';
import {
  mongooseConnect,
  mongooseDisconnect,
  mongooseDropTestCollections,
} from '../test_helper';
import User from '../../src/user';
import BlogPost from '../../src/blogPost';


test.before('connect to database', async (t) => {
  await mongooseConnect('users_test');
});

test.after.always('disconnect from database', async () => {
  await mongooseDisconnect();
});

test.beforeEach('drop test tables and create associations', async (t) => {
  await mongooseDropTestCollections();

  // create associations
  const joe = new User({
    name: 'Joe',
  });
  const blogPost = new BlogPost({
    title: 'test blogPost title',
    content: 'test blogPost content',
  });

  joe.blogPosts.push(blogPost);

  await Promise.all([
    joe.save(),
    blogPost.save(),
  ]);
});


test.serial('Removes all blogposts on a user when a user is removed', async (t) => {
  const joe = await User.findOne({ name: 'Joe' });
  await joe.remove();
  const blogPostCount = await BlogPost.count();

  t.is( blogPostCount, 0, 'all blog posts are removed via the user\'s pre `remove` hook' );
  t.pass();
});
