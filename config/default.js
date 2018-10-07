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
      sourceProductIdsUrl: 'https://gist.githubusercontent.com/daniyalzade/f7e0d469be9b8a132f9b/raw/items.csv',
      productLookupBaseUrl: 'https://api.walmartlabs.com/v1/items',
      walmartApiKey: 'kjybrqfdgp3u4yv2qzcnjndj',
      esIndexName: 'products'
    }
  }
};
