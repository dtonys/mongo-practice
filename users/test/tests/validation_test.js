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

test.serial('Make user name required', async (t) => {
  const user = new User({ name: undefined });
  const validationResult = user.validateSync();
  const { message } = validationResult.errors.name;
  t.is( message, 'Name is required.', 'A `Name is required` error message should appear' );
});

test.serial('Requires user name to be longer than 2 chars', async (t) => {
  const user = new User({ name: 'Al' });
  const validationResult = user.validateSync();
  const { message } = validationResult.errors.name;
  t.is(
    message,
    'Name must be longer than 2 characters.',
    'A `Name must be longer than 2 characters.` error message should appear',
  );
});

test.serial('disallows invalid records from being saved', async (t) => {
  const user = new User({ name: 'Al' });
  try {
    await user.save();
  }
  catch ( validationResult ) {
    const { message } = validationResult.errors.name;
    t.is(
      message,
      'Name must be longer than 2 characters.',
      'A `Name must be longer than 2 characters.` error message should appear',
    );
  }
});
