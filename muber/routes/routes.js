const DriversController = require('../controller/drivers_controller');

module.exports = (app) => {
  app.get('/api', DriversController.greeting );
  app.post('/api/drivers', DriversController.create );
  app.put('/api/drivers/:id', DriversController.edit );
  app.delete('/api/drivers/:id', DriversController.delete );
  app.get('/api/drivers', DriversController.index );
};
