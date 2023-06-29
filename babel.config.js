const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

module.exports = {
  targets: '> 0.25%, not dead',
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    // '@babel/plugin-transform-async-generator-functions'
    /*
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useEsModules: false
      }
    ]
    */
  ]
  /*
  plugins: [
    [
      '@babel/plugin-transform-arrow-functions',
      {
        spec: true
      }
    ]
  ]
  */
};
