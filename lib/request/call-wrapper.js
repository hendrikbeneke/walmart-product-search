const Promise = require('bluebird');
const config = require('config');
const log = require('../logger');

const maxRetries = config.get('request.maxRetries');
const retryDelay = config.get('request.retryDelay');

const callWrapper = async (callFn, retry = 0) => {
  try {
    return await callFn();
  } catch (err) {
    retry += 1;
    if (retry > maxRetries) {
      log.error(`Error requesting from API after ${retry - 1} retries`, err);
      throw err;
    }
    const delay = retryDelay * retry;
    log.debug(`Retrying API request after ${delay} ms. Retry: ${retry}`);
    await Promise.delay(delay);
    return callWrapper(callFn, retry);
  }
};

module.exports = callWrapper;
