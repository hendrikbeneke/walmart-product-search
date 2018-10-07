const esClient = require('./elasticsearch');
const esTemplate = require('../esTemplate/products');
const log = require('./logger');

const setupEsTemplate = async () => {
  log.info('Setting up ES template');
  log.debug(`Template: ${JSON.stringify(esTemplate)}`);

  await esClient.indices.putTemplate({
    name: 'products_template',
    body: esTemplate
  });
  log.info('Done setting up ES template');
};

module.exports = setupEsTemplate;
