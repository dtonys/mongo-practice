const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost/muber_test');
  mongoose.connection
    .on('open', () => {
      done();
    })
    .on('error', (err) => {
      console.log('Warning', err);
    });
});

beforeEach((done) => {
  const { drivers } = mongoose.connection.collections;
  drivers.drop()
    .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
    .then(() => done())
    .catch(() => done())
});
