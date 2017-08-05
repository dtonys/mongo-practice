import test from 'ava';
import mongoose from 'mongoose';
import {
  mongooseConnect,
  mongooseDisconnect,
  mongooseDropTestCollections,
} from '../test_helper';
import User from '../../src/user';
import Comment from '../../src/comment';
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
  const comment = new Comment({
    content: 'test Comment content',
  });

  joe.blogPosts.push(blogPost);
  blogPost.comments.push(comment);
  comment.user = joe;

  await Promise.all([
    joe.save(),
    blogPost.save(),
    comment.save(),
  ]);
});

test.serial('get blogpost associated with joe', async (t) => {
  const user = await User
    .findOne({ name: 'Joe' })
    .populate('blogPosts');
  t.is(user.blogPosts[0].title, 'test blogPost title', 'loaded the associated blogpost via `populate`');
  t.pass();
});

test.serial('save a full relation graph', async (t) => {
  const user = await User
    .findOne({ name: 'Joe' })
    .populate({
      path: 'blogPosts',
      populate: {
        path: 'comments',
        populate: {
          path: 'user',
        },
      }
    });

  console.log('save a full relation graph passed');

  t.is(
    user.name,
    'Joe',
    'user\'s name is correct'
  );
  t.is(
    user.blogPosts[0].title,
    'test blogPost title',
    'correct blog post on user is populated'
  );
  t.is(
    user.blogPosts[0].comments[0].content,
    'test Comment content',
    'correct comment on blog post is populated'
  );
  t.is(
    user.blogPosts[0].comments[0].user.name,
    'Joe',
    'correct user on comment post is populated'
  );
  t.pass();
});







