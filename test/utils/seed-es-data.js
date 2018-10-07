const config = require('config');
const Promise = require('bluebird');
const esClient = require('../../lib/elasticsearch');
const log = require('../../lib/logger');
const products = require('./products');
const esTemplate = require('../../esTemplate/products');

const esIndexName = config.get('jobs.syncProductData.esIndexName');

module.exports = async () => {
  await esClient.indices.delete({ index: '_all' });
  await esClient.indices.deleteTemplate({ name: 'products_template' });
  await esClient.indices.putTemplate({
    name: 'products_template',
    body: esTemplate
  });

  const body = [];
  products.forEach(p => {
    body.push({ index: { _index: esIndexName, _type: '_doc', _id: p.itemId } });
    body.push(p);
  });

  const result = await esClient.bulk({ body });
  if (result.errors) {
    log.error(result);
    throw new Error('Errors indexing documents');
  }
  const esIndexDelay = 1000;
  return Promise.delay(esIndexDelay);
};
