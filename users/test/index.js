import test from 'tape-async';
import {
  mongooseConnect,
  mongooseDisconnect,
} from './test_helper';

test('connect to mongo', async (assert) => {
  await mongooseConnect();
  assert.end();
});

require('./create_test');
require('./read_test');
require('./update_test');
require('./delete_test');

test('disconnect from mongo', (assert) => {
  mongooseDisconnect();
  assert.end();
});
