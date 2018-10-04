const config = require('config');
const bunyan = require('bunyan');
const { name } = require('../package');

const streams = [];
const level = config.get('logging.level');
const pretty = config.get('logging.prettyprint');

if (pretty) {
  const PrettyStream = require('bunyan-prettystream');
  const stream = new PrettyStream();
  stream.pipe(process.stdout);
  streams.push({
    level,
    type: 'raw',
    stream
  });
} else {
  streams.push({
    level,
    stream: process.stdout
  });
}

module.exports = bunyan.createLogger({ streams, name });
