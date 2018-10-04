const Joi = require('joi');
const mongo = require('../../lib/mongo');
const searchProducts = require('../../lib/search-products');

const maxResultSize = 1000;
const defaultResultSize = 10;

module.exports = {
  register: server => {
    server.route({
      method: 'GET',
      path: '/v1/products/search',
      config: {
        validate: {
          query: {
            result: Joi.object().keys({
              from: Joi.number().integer().min(0).default(0),
              size: Joi.number().integer().min(0).max(maxResultSize).default(defaultResultSize)
            }).optional(),
            keyword: Joi.string().required()
          }
        }
      },
      handler: async request => {
        const { result, keyword } = request.query;
        return searchProducts({ result, keyword });
      }
    });
  },
  name: 'search',
  version: '1.0.0'
};
