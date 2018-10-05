const esClient = require('./elasticsearch');
const esTemplate = require('../esTemplate/products');
const log = require('./logger');

const setupEsTemplate = async () => {
  log.info('Setting up ES templates');
  log.debug(`Template: ${JSON.stringify(esTemplate)}`);

  await esClient.indices.putTemplate({
    name: 'products_template',
    body: esTemplate
  });
  log.info('Done setting up ES templates');
};

module.exports = setupEsTemplate;
