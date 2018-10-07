const log = require('./lib/logger');
const server = require('./server');

process.on('unhandledRejection', error => {
  throw error;
});

const run = async () => {
  const serverInstance = await server();
  await serverInstance.start();
  log.info(`Server running at: ${serverInstance.info.uri}`);
};

run()
  .catch(err => {
    log.error(err);
    process.exit(1);
  });

