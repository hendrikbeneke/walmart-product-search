const log = require('./lib/logger');
const esClient = require('./lib/elasticsearch');
const esTemplate = require('./esTemplate/products');

const setupEsTemplate = async () => {
  log.info('Setting up ES templates');
  log.debug(`Template: ${JSON.stringify(esTemplate)}`);

  await esClient.indices.putTemplate({
    name: 'products_template',
    body: esTemplate
  });
  log.info('Done setting up ES templates');
};

const setup = async () => {
  log.info('Starting setup');
  await setupEsTemplate();
  log.info('Done setup');
};

setup()
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
