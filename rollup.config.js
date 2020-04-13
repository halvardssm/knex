const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
module.exports = {
  input: './knex.js',
  output: {
    file: 'knex-es.js',
    format: 'es',
  },
  plugins: [commonjs(), resolve()],
};
