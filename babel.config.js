const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

module.exports = {
  targets: '> 0.25%, not dead',
  presets: ['@babel/preset-env', '@babel/preset-react']
};
