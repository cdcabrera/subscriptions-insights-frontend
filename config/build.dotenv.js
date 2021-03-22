const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const Dotenv = require('dotenv-webpack');

/**
 * Setup a webpack dotenv plugin config.
 *
 * @param {string} filePath
 * @returns {*}
 */
const setupWebpackDotenvFile = filePath => {
  const settings = {
    systemvars: true,
    silent: true
  };

  if (filePath) {
    settings.path = filePath;
  }

  return new Dotenv(settings);
};

/**
 * Setup multiple webpack dotenv file parameters.
 *
 * @param {object} params
 * @param {string} params.directory
 * @param {string} params.env
 * @returns {Array}
 */
const setupWebpackDotenvFilesForEnv = ({ directory, env } = {}) => {
  const dotenvWebpackSettings = [];

  if (env) {
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, `.env.${env}.local`)));
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, `.env.${env}`)));
  }

  dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '.env.local')));
  dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '.env')));

  return dotenvWebpackSettings;
};

/**
 * Setup, and access, a dotenv file and the related set of parameters.
 *
 * @param {string} filePath
 * @returns {void}
 */
const setupDotenvFile = filePath => {
  const dotenvInitial = dotenv.config({ path: filePath });
  dotenvExpand(dotenvInitial);
};

/**
 * Setup and access local and specific dotenv file parameters.
 *
 * @param {object} params
 * @param {string} params.env
 */
const setupDotenvFilesForEnv = ({ env } = {}) => {
  const RELATIVE_DIRNAME = path.resolve(__dirname, '..');

  if (env) {
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.local'));
  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env'));

  const STATIC_DIR = process.env.OSEED_STATIC_DIR || 'public';
  const PUBLIC_PATH = process.env.OSEED_PUBLIC_PATH || '/';
  const SRC_DIR = path.resolve(RELATIVE_DIRNAME, process.env.OSEED_SRC_DIR || 'src');
  const DIST_DIR = path.resolve(RELATIVE_DIRNAME, process.env.OSEED_DIST_DIR || 'dist');
  const HOST = process.env.OSEED_HOST || 'localhost';
  const PORT = process.env.OSEED_PORT || '3000';
  const DEV_MODE = process.env.OSEED_DEV_MODE || undefined;
  const OUTPUT_ONLY = process.env._OSEED_OUTPUT_ONLY === 'true';

  process.env._OSEED_ENV = process.env.REACT_APP_ENV;
  process.env._OSEED_STATIC_DIR = STATIC_DIR;
  process.env._OSEED_RELATIVE_DIRNAME = RELATIVE_DIRNAME;
  process.env._OSEED_PUBLIC_PATH = PUBLIC_PATH;
  process.env._OSEED_SRC_DIR = SRC_DIR;
  process.env._OSEED_DIST_DIR = DIST_DIR;
  process.env._OSEED_HOST = HOST;
  process.env._OSEED_PORT = PORT;
  process.env._OSEED_OUTPUT_ONLY = OUTPUT_ONLY;
  process.env._OSEED_DEV_MODE = DEV_MODE;
};

module.exports = { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv };
