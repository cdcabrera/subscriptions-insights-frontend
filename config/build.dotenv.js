const fs = require('fs');
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
const setupDotenvFile = (filePath, addedDotEnvParams = {}) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>> expand', process.env.UI_DEPLOY_PATH_PREFIX);

  const cachedDotEnv = {};
  // const dotenvInitial = dotenv.config({ path: filePath });
  if (fs.existsSync(filePath)) {
    const dotenvInitial = dotenv.parse(fs.readFileSync(filePath));
    // const dotenvInitial = dotenv.config({ path: filePath });
    // dotenvExpand(dotenvInitial);
    // cachedDotEnv = {};
    Object.entries(dotenvInitial).forEach(([key, value]) => {
      cachedDotEnv[key] = value;
    });
  }
    // Object.entries(addedDotEnvParams).forEach(([key, value]) => {
    //  cachedDotEnv[key] = value;
    // });

    dotenvExpand({ignoreProcessEnv: false, parsed: cachedDotEnv});
  /*
  const setDotEnv = () => {
    const dotenvInitial = dotenv.config({ path: filePath });
    dotenvExpand(dotenvInitial);
  };

  return setDotEnv;
  */
};

/**
 * Setup and access local and specific dotenv file parameters.
 *
 * @param {object} params
 * @param {object} params.addEnvParams
 * @param {string} params.env
 * @param {string} params.relativePath
 * @param {string} params.dotenvNamePrefix
 * @param {boolean} params.setBuildDefaults
 * @returns {object}
 */
const setupDotenvFilesForEnv = ({
  addEnvParams = {},
  env,
  relativePath = path.resolve(__dirname, '..'),
  dotenvNamePrefix = 'BUILD',
  setBuildDefaults = true
} = {}) => {
  const setupProcessEnv = (addedDotEnvParams = {}) => {
    if (env) {
      setupDotenvFile(path.resolve(relativePath, `.env.${env}.local`), addedDotEnvParams);
      setupDotenvFile(path.resolve(relativePath, `.env.${env}`), addedDotEnvParams);
    }

    setupDotenvFile(path.resolve(relativePath, '.env.local'), addedDotEnvParams);
    setupDotenvFile(path.resolve(relativePath, '.env'), addedDotEnvParams);
  };

  setupProcessEnv();

  const cachedAdded = {};
  Object.entries(addEnvParams).forEach(([key, value]) => {
    let tempValue = value;
    if (typeof tempValue === 'function') {
      tempValue = tempValue(process.env);
    }

    console.log('WORK >>>>>>>>>>>', key, tempValue);

    process.env[key] = tempValue;
    cachedAdded[key] = tempValue;
  });

  console.log('WORK 2 >>>>>>>>>>>>>>>>>>>>', cachedAdded.UI_DEPLOY_PATH_PREFIX, process.env.UI_DEPLOY_PATH_PREFIX);
  console.log('WORK 2 >>>>>>>>>>>>>>>>>>>>', process.env.REACT_APP_UI_DEPLOY_PATH_PREFIX);

  setupProcessEnv(cachedAdded);

  console.log('WORK 3 >>>>>>>>>>>>>>>>>>>>', process.env.UI_DEPLOY_PATH_PREFIX);
  console.log('WORK 3 >>>>>>>>>>>>>>>>>>>>', process.env.REACT_APP_CONFIG_SERVICE_LOCALES);

  if (setBuildDefaults) {
    const DEV_MODE = process.env[`${dotenvNamePrefix}_DEV_MODE`] || undefined;
    const DIST_DIR = path.resolve(relativePath, process.env[`${dotenvNamePrefix}_DIST_DIR`] || 'dist');
    const HOST = process.env[`${dotenvNamePrefix}_HOST`] || 'localhost';
    const OUTPUT_ONLY = process.env[`_${dotenvNamePrefix}_OUTPUT_ONLY`] === 'true';
    const PORT = process.env[`${dotenvNamePrefix}_PORT`] || '3000';
    const PUBLIC_PATH = process.env[`${dotenvNamePrefix}_PUBLIC_PATH`] || '/';
    const SRC_DIR = path.resolve(relativePath, process.env[`${dotenvNamePrefix}_SRC_DIR`] || 'src');
    const STATIC_DIR = path.resolve(relativePath, process.env[`${dotenvNamePrefix}_STATIC_DIR`] || 'public');

    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = env;
    }

    process.env[`_${dotenvNamePrefix}_ENV`] = process.env.NODE_ENV;
    process.env[`_${dotenvNamePrefix}_STATIC_DIR`] = STATIC_DIR;
    process.env[`_${dotenvNamePrefix}_RELATIVE_DIRNAME`] = relativePath;
    process.env[`_${dotenvNamePrefix}_PUBLIC_PATH`] = PUBLIC_PATH;
    process.env[`_${dotenvNamePrefix}_SRC_DIR`] = SRC_DIR;
    process.env[`_${dotenvNamePrefix}_DIST_DIR`] = DIST_DIR;
    process.env[`_${dotenvNamePrefix}_HOST`] = HOST;
    process.env[`_${dotenvNamePrefix}_PORT`] = PORT;
    process.env[`_${dotenvNamePrefix}_OUTPUT_ONLY`] = OUTPUT_ONLY;
    process.env[`_${dotenvNamePrefix}_DEV_MODE`] = DEV_MODE;
  }

  return process.env;
};

module.exports = { setupDotenvFilesForEnv, setupWebpackDotenvFilesForEnv };
