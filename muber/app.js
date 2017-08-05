const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
if ( process.env.NODE_ENV !== 'test' ) {
  mongoose.connect('mongodb://localhost/muber');
}


app.use(bodyParser.json());

routes(app);
app.use(( err, req, res, next ) => {
  const errorMessage = err.message || err._message;
  res.status(422);
  res.send({ error: errorMessage });
});

module.exports = app;
