module.exports = {
  logging: {
    level: 'debug'
  },
  mongodb: {
    connection: process.env.MONGODB
  },
  elasticsearch: {
    connection: process.env.ES
  },
  jobs: {
    syncProductData: {
      walmartApiKey: 'WALMARTAPIKEY'
    }
  }
};
