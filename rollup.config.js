const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: './knex.js',
  output: {
    file: 'knex-es.js',
    format: 'es',
  },
  plugins: [commonjs()],
};
