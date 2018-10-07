const { expect } = require('chai');
const serverHelper = require('../../utils/http-test-helper');
const seedEsData = require('../../utils/seed-es-data');
const route = require('../../../server/routes/search');
const codeOK = 200;
const codeBadRequest = 400;

describe('Search Products', async () => {
  describe('with keyword backpack', async () => {
    let response;
    let server;
    let payload;

    before(async () => {
      await seedEsData();
      server = await serverHelper.getServer(route);
      const options = {
        method: 'GET',
        url: '/products/search?keyword=backpack'
      };
      response = await server.inject(options);
      payload = JSON.parse(response.payload);
    });

    it('returns status code 200', () => {
      expect(response.statusCode).to.be.eq(codeOK);
    });

    it('returns 3 search results', () => {
      const expectedResultsLength = 3;
      expect(payload).to.be.an('object');
      expect(payload.results).to.be.an('array');
      expect(payload.results.length).to.be.eq(expectedResultsLength);
    });

    it('returns valid results', () => {
      const firstResult = payload.results[0];
      expect(firstResult).to.include.all.keys('itemId', 'name', 'shortDescription', 'longDescription');
    });

    it('returns correct pagination keys', () => {
      expect(payload).to.deep.include({ total: 3, size: 10, from: 0 });
    });

    describe('with pagination', async () => {
      before(async () => {
        server = await serverHelper.getServer(route);
        const options = {
          method: 'GET',
          url: `/products/search?keyword=backpack&result=${encodeURI(JSON.stringify({ from: 2 }))}`
        };
        response = await server.inject(options);
        payload = JSON.parse(response.payload);
      });

      it('returns status code 200', () => {
        expect(response.statusCode).to.be.eq(codeOK);
      });

      it('returns 1 search results', () => {
        const expectedResultsLength = 1;
        expect(payload).to.be.an('object');
        expect(payload.results).to.be.an('array');
        expect(payload.results.length).to.be.eq(expectedResultsLength);
      });

      it('returns valid results', () => {
        const firstResult = payload.results[0];
        expect(firstResult).to.include.all.keys('itemId', 'name', 'shortDescription', 'longDescription');
      });

      it('returns correct pagination keys', () => {
        expect(payload).to.deep.include({ total: 3, size: 10, from: 2 });
      });
    });
  });

  describe('with unknown keyword', async () => {
    let response;
    let server;
    let payload;

    before(async () => {
      await seedEsData();
      server = await serverHelper.getServer(route);
      const options = {
        method: 'GET',
        url: '/products/search?keyword=nothingfound'
      };
      response = await server.inject(options);
      payload = JSON.parse(response.payload);
    });

    it('returns status code 200', () => {
      expect(response.statusCode).to.be.eq(codeOK);
    });

    it('returns 0 search results', () => {
      const expectedResultsLength = 0;
      expect(payload).to.be.an('object');
      expect(payload.results).to.be.an('array');
      expect(payload.results.length).to.be.eq(expectedResultsLength);
    });

    it('returns correct pagination keys', () => {
      expect(payload).to.deep.include({ total: 0, size: 10, from: 0 });
    });
  });

  describe('with invalid query params', async () => {
    let response;
    let server;
    let payload;

    before(async () => {
      await seedEsData();
      server = await serverHelper.getServer(route);
      const options = {
        method: 'GET',
        url: '/products/search?keywords=something'
      };
      response = await server.inject(options);
      payload = JSON.parse(response.payload);
    });

    it('returns status code 400', () => {
      expect(response.statusCode).to.be.eq(codeBadRequest);
    });

    it('returns proper error message', () => {
      expect(payload.message).to.be.eq('child "keyword" fails because ["keyword" is required]');
    });
  });
});
