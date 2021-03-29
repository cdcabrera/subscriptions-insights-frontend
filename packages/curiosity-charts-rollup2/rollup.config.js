import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import pluginJson from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
const path = require('path');
const pkg = require('./package');
const { setupDotenvFilesForEnv } = require('./dotenv');

process.env.NODE_ENV = 'production';
const dotenvVars = setupDotenvFilesForEnv({
  env: 'production',
  dotenvNamePrefix: 'REACT_APP',
  relativePath: path.resolve(__dirname, '..', '..')
});
const updatedDotenvVars = {};

Object.entries(dotenvVars).forEach(([key, value]) => {
  updatedDotenvVars[`process.env.${key}`] = JSON.stringify(value);
});

// One off React App values
updatedDotenvVars[`process.env.PUBLIC_URL`] = JSON.stringify(process.env.PUBLIC_URL);

export default {
  input: pkg.source,
  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true
    },
    {
      exports: 'named',
      file: pkg.module,
      format: 'esm',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal({
      // includeDependencies: true
    }),
    commonjs({
      include: /node_modules/
    }),
    nodeResolve({
      preferBuiltins: true,
      extensions: ['.js']
    }),
    pluginJson(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      ...updatedDotenvVars
    }),
    postcss({
      // extract: true, separate css files
      extract: false,
      modules: true,
      use: ['sass']
    }),
    // base64 images in output, use sparingly
    image(),
    babel({
      presets: ['react-app'],
      // presets: ['@babel/preset-react'],
      // plugins: ['@babel/plugin-syntax-class-properties'],
      // babelHelpers: 'bundled'
      babelHelpers: 'runtime'
      // exclude: 'node_modules/**'
    }),
    del({ targets: ['dist/*'] })
  ],
  external: Object.keys(pkg.peerDependencies || {})
};
