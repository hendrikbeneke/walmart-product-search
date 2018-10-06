const Hapi = require('hapi');
const config = require('config');

module.exports = {
  getServer: async route => {
    const validate = {
      failAction: (request, h, err) => {
        throw err;
      }
    };

    const server = Hapi.server({ routes: { cors: true, validate }, debug: { request: ['error'] } });
    await server.register([
      {
        plugin: route
      }
    ]);
    return server;
  }
};
