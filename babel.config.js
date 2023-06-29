const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

module.exports = {
  targets: '> 0.25%, not dead',
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-runtime'
    /*
    [
      'transform-imports',
      {
        '@patternfly/react-icons': {
          transform: importName => {
            if (importName === 'IconSize') {
              return `@patternfly/react-icons/dist/js/createIcon`;
            }

            return `@patternfly/react-icons/dist/js/icons/${importName
              .split(/(?=[A-Z])/)
              .join('-')
              .toLowerCase()}`;
          },
          preventFullImport: true
        }
      },
      'react-icons'
    ]
     */
  ]
};
