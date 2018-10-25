// load this into places that do not have access to the serverless setup
// loaded in test files: "test/_test-setup.js"
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');

try {
  const envParsed = dotenv.config().parsed;
  const envVars = YAML.safeLoad(fs.readFileSync(path.join(__dirname, `./env/${process.env.NODE_ENV}.yml`)));
  Object.keys(envVars).forEach(key => {
    if (envParsed[key]) process.env[key] = envParsed[key];
    else process.env[key] = envVars[key] ? envVars[key] : '';
  });
} catch (e) {}

// example of possibel export for sequalize database
module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT || 'mysql',
};
