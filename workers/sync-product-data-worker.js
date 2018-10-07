const config = require('config');
const log = require('../lib/logger');
const agendaPromise = require('../lib/agenda');
const syncProductData = require('../lib/sync-product-data');

const name = config.get('jobs.syncProductData.name');
const cronInterval = config.get('jobs.syncProductData.cronInterval');

let agenda;

const options = {
  concurrency: 1,
  lockLimit: 1,
  priority: 'highest'
};

agendaPromise
  .then(_agenda => {
    agenda = _agenda;
    log.info(`Creating job ${name}`);
    agenda.define(name, options, async (job, done) => {
      log.info(`Executing job ${job.attrs.name}`);
      try {
        await syncProductData();
      } catch (err) {
        log.error(err);
        done(err);
      }
    });
    agenda.every(cronInterval, name);
    agenda.start();
  })
  .catch(err => {
    log.error(err);
    throw err;
  });

const shutdown = () => {
  if (agenda) {
    agenda.stop(() => {
      log.info('Shutting down scheduler...');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
