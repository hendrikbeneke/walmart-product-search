module.exports = {
  app: {
    port: 3001
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
  }
};
