const { existsSync, readFileSync, writeFileSync } = require('fs');

// const { RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES } = require('../src/services/rhsm/rhsmConstants');

const output = readFileSync('./src/services/rhsm/rhsmConstants.js', 'utf-8')
  .split('const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {')[1]
  .split('};')[0];

console.log('>>>> output', output);
