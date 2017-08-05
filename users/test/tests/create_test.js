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

test.serial('Create a new user`', async (t) => {
  const user_1 = new User({
    name: 'user_1',
  });
  try {
    const result = await user_1.save();
    t.true( !user_1.isNew, 'user\'s `isNew` flag is false after a save' );
    await user_1.remove();
    await mongoose.connection.collections.users.drop();
  }
  catch ( error ) {
    console.log('error');
    console.log(error);
  }
});

