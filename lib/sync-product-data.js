const config = require('config');
const request = require('request-promise');
const _ = require('lodash');
const Promise = require('bluebird');
const log = require('./logger');
const esClient = require('./elasticsearch');
const callWrapper = require('./request/call-wrapper');

const productIdChunkSize = 10;
const sourceProductIdsUrl = config.get('jobs.syncProductData.sourceProductIdsUrl');
const productLookupBaseUrl = config.get('jobs.syncProductData.productLookupBaseUrl');
const walmartApiKey = config.get('jobs.syncProductData.walmartApiKey');
const esIndexName = config.get('jobs.syncProductData.esIndexName');

const syncProductData = async () => {
  log.debug('Getting list of product IDs');
  const productIdsCsv = await callWrapper(() => request.get(sourceProductIdsUrl));
  const productIds = productIdsCsv.match(/(\d+)/g);
  const productIdChunks = _.chunk(productIds, productIdChunkSize);

  return Promise.mapSeries(productIdChunks, async idChunk => {
    const idString = idChunk.join(',');
    log.debug(`Getting products for IDs: ${idString}`);
    const products = await callWrapper(() => {
      return request.get(`${productLookupBaseUrl}?ids=${idString}&apiKey=${walmartApiKey}`, { json: true });
    });
    log.debug(`Indexing products in ES for IDs: ${idString}`);
    const body = [];
    products.items.forEach(p => {
      body.push({ index: { _index: esIndexName, _type: '_doc', _id: p.itemId } });
      body.push(p);
    });

    const result = await esClient.bulk({ body });
    if (result.errors) {
      log.error(`Errors in indexing bulk action: ${JSON.stringify(result)}`);
      throw new Error('Errors indexing documents');
    }
    log.debug(`Done indexing products in ES for IDs: ${idString}`);
  });
};

module.exports = syncProductData;
