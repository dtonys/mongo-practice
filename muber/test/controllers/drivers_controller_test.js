const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');


const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('POST `/api/drivers` creates a new driver', (done) => {
    Driver.count().then((count) => {
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' })
        .end((err, response) => {
          Driver.count().then((newCount) => {
            assert( count + 1 === newCount )
            done();
          });
        });
    });
  });

  it('PUT `/api/drivers/:id` creates a new driver', (done) => {
    const driver = new Driver({
      email: 't@t.com',
      driving: false,
    });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end((err, response) => {
          Driver.findOne({ email: 't@t.com' }).then((queriedDriver) => {
            assert( queriedDriver.driving === true );
            done();
          });
        });
    });

  });

  it('DELETE `/api/drivers/:id` deletes an existing driver', (done) => {
    const driver = new Driver({
      email: 't2@t.com',
      driving: false,
    });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end((err, response) => {
          Driver.findOne({ email: 't2@t.com' })
            .then((queriedDriver) => {
              assert( queriedDriver === null );
              done();
            });
        });
    });
  });

  it('GET `/api/drivers` returns drivers near a location', (done) => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: {
        type: 'Point',
        coordinates: [-122.4759902, 47.6147628],
      },
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: {
        type: 'Point',
        coordinates: [-80.253, 25.791],
      },
    });
    Promise.all([
      seattleDriver.save(),
      miamiDriver.save(),
    ]).then((results) => {
      const _seattleDriver = results[0];
      const _miamiDriver = results[1];
      request(app)
        .get('/api/drivers?lng=-80&lat=25')
        .end((err, response) => {
          assert( response.body.length === 1 );
          assert( response.body[0].obj.email === 'miami@test.com' );
          done();
        })
    });
  });

});