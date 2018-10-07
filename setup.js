const log = require('./lib/logger');
const setupEsTemplate = require('./lib/setup-es-template');
const syncProductData = require('./lib/sync-product-data');

const setup = async () => {
  log.info('Starting setup');
  await setupEsTemplate();
  await syncProductData();
  log.info('Done setup');
};

setup()
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
