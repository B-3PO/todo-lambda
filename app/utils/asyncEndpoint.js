// handles thrown erros
// converts thrown erros to 500 responses
const logger = require('../utils/logger');

const devEnvs = ['development', 'test', 'sandbox', 'debug'];

module.exports = (fn) => (event, context) => fn(event, context)
  .then(response => {
    // headers to all responses
    if (!response.headers) response.headers = {};
    // this header is required for cors to work
    response.headers['Access-Control-Allow-Origin'] = '*';
    return response;
  })
  .catch(e => {
    logger.error(e);
    const errorBody = { errorMessage: e.message };

    // add stacktrace if not in production
    if (devEnvs.includes(process.env.NODE_ENV)) {
      errorBody.errorType = 'Error';
      errorBody.stackTrace = e.stack.split('\n').map(line => line.trim());
    }

    const response = {
      statusCode: 500,
      body: JSON.stringify(errorBody)
    };

    return response;
  });
