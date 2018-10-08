const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const nock = require('nock');
const responses = require('../utils/sync-product-http-calls');

const codeOK = 200;

const bulkStub = sinon.stub();
const esClientStub = {
  bulk: bulkStub
};

const setupSuccessNocks = () => {
  nock('https://gist.githubusercontent.com:443')
    .get('/daniyalzade/f7e0d469be9b8a132f9b/raw/items.csv')
    .reply(codeOK, responses.github);

  nock('https://api.walmartlabs.com:443')
    .get('/v1/items')
    .query({
      ids: '14225185,14225186,14225188,14225187,39082884,30146244,12662817,34890820,19716431,42391766',
      apiKey: 'WALMARTAPIKEY'
    })
    .reply(codeOK, responses.walmart1, ['Content-Type', 'application/json; charset=utf-8']);

  nock('https://api.walmartlabs.com:443')
    .get('/v1/items')
    .query({
      ids: '35813552,40611708,40611825,36248492,44109840,23117408,35613901,42248076',
      apiKey: 'WALMARTAPIKEY'
    })
    .reply(codeOK, responses.walmart2, ['Content-Type', 'application/json; charset=utf-8']);
};

const syncProductData = proxyquire(
  '../../lib/sync-product-data',
  {
    './elasticsearch': esClientStub
  }
);

describe('Sync Product Data', async () => {
  before('Disable Net Connect', () => {
    nock.disableNetConnect();
  });

  after('Clear Nock & Enable Net Connect', () => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('Successful sync', async () => {
    before(async () => {
      bulkStub.reset();
      bulkStub.resolves({});
      setupSuccessNocks();
      await syncProductData();
    });

    after(() => {
      nock.cleanAll();
    });

    it('calls ES bulk function twice', () => {
      const expectedCallCount = 2;
      expect(bulkStub.callCount).to.be.eq(expectedCallCount);
    });

    it('calls ES bulk function with correct arguments', () => {
      expect(bulkStub.args[0]).to.be.deep.equal([responses.esBulk0]);
      expect(bulkStub.args[1]).to.be.deep.equal([responses.esBulk1]);
    });
  });

  describe('Failure on bulk request', async () => {
    let error;
    before(async () => {
      bulkStub.reset();
      bulkStub.resolves({ errors: true });
      setupSuccessNocks();
      try {
        await syncProductData();
      } catch (err) {
        error = err;
      }
    });

    after(() => {
      nock.cleanAll();
    });

    it('calls ES bulk function once', () => {
      const expectedCallCount = 1;
      expect(bulkStub.callCount).to.be.eq(expectedCallCount);
    });

    it('throws error', () => {
      expect(error.message).to.be.eq('Errors indexing documents');
    });
  });
});
