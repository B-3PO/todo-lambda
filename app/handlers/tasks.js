const asyncEndpoint = require('../utils/asyncEndpoint');
const service = require('../services/tasks');
const logger = require('../utils/logger');

// handler for http endpoint
exports.get = asyncEndpoint(async event => {
  const results = await service.get();
  logger.info(results);

  // defaults to 200
  return {
    body: results
  };

  // thrown errors will be converted to responses with status code = 500.
  // thrown stack trace will be sent down
});

// handler for http endpoint
exports.create = asyncEndpoint(async event => {
  const { name } = event.pathParameters;

  if (!name) {
    return {
      statusCode: 409,
      body: {
        meesage: JSON.stringify('name is required')
      }
    };
  }

  const results = await service.create(name);
  logger.info(results);

  // defaults to 200
  return {
    body: results
  };

  // thrown errors will be converted to responses with status code = 500.
  // thrown stak trace will be sent down
});

// handler for http endpoint
exports.delete = asyncEndpoint(async event => {
  const { id } = event.pathParameters;

  if (!id) {
    return {
      statusCode: 409,
      body: {
        meesage: JSON.stringify('id is required')
      }
    };
  }

  const results = await service.delete(id);
  logger.info(results);

  // defaults to 200
  return {
    body: results
  };

  // thrown errors will be converted to responses with status code = 500.
  // thrown stak trace will be sent down
});
