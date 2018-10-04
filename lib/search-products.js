const _ = require('lodash');
const esClient = require('./elasticsearch');

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

  const searchResult = await esClient.search({
    index: 'products',
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
