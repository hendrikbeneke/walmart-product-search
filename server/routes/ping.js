module.exports = {
  register: server => {
    server.route({
      method: 'GET',
      path: '/ping',
      handler: async () => {
        return 'OK';
      }
    });
  },
  name: 'ping',
  version: '1.0.0'
};
