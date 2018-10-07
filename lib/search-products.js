const _ = require('lodash');
const config = require('config');
const esClient = require('./elasticsearch');
const log = require('./logger');

const esIndexName = config.get('jobs.syncProductData.esIndexName');

module.exports = async ({ result = {}, keyword }) => {
  const body = {};

  if (result) {
    _.defaults(result, { from: 0, size: 10 });
    body.from = result.from;
    body.size = result.size;
  }

  body.query = {
    // eslint-disable-next-line camelcase
    multi_match: {
      query: keyword,
      fields: ['name', 'shortDescription', 'longDescription']
    }
  };

  log.info(`Searching for products with query: ${keyword}`);
  const searchResult = await esClient.search({
    index: esIndexName,
    body
  });

  const esHits = searchResult.hits;

  return {
    total: esHits.total,
    size: result.size,
    from: result.from,
    // eslint-disable-next-line no-underscore-dangle
    results: _.map(esHits.hits, r => r._source)
  };
};
