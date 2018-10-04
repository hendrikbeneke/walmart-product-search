const config = require('config');
const MongoClient = require('mongodb').MongoClient;

const url = config.get('mongodb.connection');
let client;

module.exports = {
  init: async () => {
    client = await MongoClient.connect(url);
  },
  getClient: () => {
    if (!client) {
      throw new Error('Init client first');
    }
    return client;
  }
};
