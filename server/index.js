const Hapi = require('hapi');
const config = require('config');
const pingRoute = require('./routes/ping');
const searchRoute = require('./routes/search');
const mongo = require('../lib/mongo');

const port = config.get('app.port');

module.exports = async () => {
  await mongo.init();
  const validate = {
    failAction: (request, h, err) => {
      throw err;
    }
  };
  const server = Hapi.server({ port, routes: { cors: true, validate }, debug: { request: ['error'] } });
  await server.register([
    {
      plugin: pingRoute
    },
    {
      plugin: searchRoute
    }
  ]);

  return server;
};
