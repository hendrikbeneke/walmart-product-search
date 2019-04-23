/* eslint-disable no-magic-numbers */
module.exports = {
  app: {
    port: 3001
  },
  request: {
    maxRetries: 3,
    retryDelay: 2000
  },
  logging: {
    level: 'debug',
    prettyprint: false
  },
  mongodb: {
    connection: 'mongodb://localhost:27017/walmart-product-search'
  },
  elasticsearch: {
    connection: 'http://localhost:9200',
    apiVersion: '6.x'
  },
  jobs: {
    syncProductData: {
      name: 'sync-product-data',
      cronInterval: '0 * * * *',
      productLookupBaseUrl: 'https://api.walmartlabs.com/v1/items',
      walmartApiKey: 'kjybrqfdgp3u4yv2qzcnjndj',
      esIndexName: 'products',
      productIds: [
        14225185,
        14225186,
        14225188,
        14225187,
        39082884,
        30146244,
        12662817,
        34890820,
        19716431,
        42391766
      ]
    }
  }
};
