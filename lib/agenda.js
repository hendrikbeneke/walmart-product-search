const config = require('config');
const Agenda = require('agenda');
const log = require('./logger');
const Promise = require('bluebird');

const address = config.get('mongodb.connection');
const agenda = new Agenda({ db: { address } });

module.exports = new Promise((resolve, reject) => {
  log.info('Initializing Agenda');
  agenda.on('ready', () => {
    resolve(agenda);
  });

  agenda.on('error', err => {
    reject(err);
  });
});
