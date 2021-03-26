import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

process.env.NODE_ENV = 'production';

export default {
  input: pkg.source,
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named' },
    { file: pkg.module, format: 'esm', exports: 'named' }
  ],
  plugins: [
    external(),
    nodeResolve({
      extensions: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      // presets: ['react-app'],
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled'
      // exclude: 'node_modules/**'
    }),
    del({ targets: ['dist/*'] })
  ],
  external: Object.keys(pkg.peerDependencies || {})
};
