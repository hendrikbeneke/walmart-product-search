const elasticsearch = require('elasticsearch');
const config = require('config');

const host = config.get('elasticsearch.connection');
const apiVersion = config.get('elasticsearch.apiVersion');

const options = {
  host,
  apiVersion
};

const client = new elasticsearch.Client(options);

module.exports = client;
