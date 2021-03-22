const path = require('path');

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
  babel: {
    // ignore: ['**/*.archive']
    // cherryPick: ['curiosityServices/config', 'curiosityServices/rhsmServices']
  },
  webpack: {
    terser: {
      terserOptions: {
        mangle: true,
        beautify: false
      }
    },
    /*
    extra: {
      resolve: {
        alias: {
          '@curiosity': path.resolve(__dirname, '../../', 'src')
        },
        roots: []
      }
    },
     */
    /*
    extra: {
      // symlinks: true
      module: {
        rules: [
          {
            test: /\.archive\//,
            exclude: '.archive'
          }
        ]
      },
      externals: {
        subtract: {
          root: ['.archive']
        }
      }
    },
    */
    aliases: {
      // '@curiosity': path.resolve(__dirname, '../../', 'src')
      // '@curiosity': path.resolve(__dirname, 'src', 'curiosity')
    }
  }
};
