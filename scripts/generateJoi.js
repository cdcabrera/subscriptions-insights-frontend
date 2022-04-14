const swaggerToJoi = require('swagger-to-joi');
const { join: joinPath } = require('path');
const { execSync } = require('child_process');
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const YAML = require('yamljs');
const _get = require('lodash/get');

const spec = [
  {
    file: 'https://raw.githubusercontent.com/RedHatInsights/rhsm-subscriptions/develop/api/rhsm-subscriptions-api-spec.yaml',
    outputDir: `${process.cwd()}/.openapi`,
    outputFileName: 'rhsm.yaml'
  }
];

/**
 * Set display colors
 *
 * @param {string} str
 * @param {string} color
 * @returns {string}
 */
const setColor = (str, color = 'reset') => {
  const colors = {
    blue: '\x1b[34m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
    yellow: '\x1b[33m'
  };

  return `${colors[color.toLowerCase()] || colors.reset}${str}${colors.reset}`;
};

/**
 * Load remote files and cache, or just confirm a local file.
 *
 * @param {Array} inputPaths
 * @returns {Array}
 */
const getApiSpec = (inputPaths = []) => {
  const outputPaths = [];

  inputPaths.forEach(({ file, outputDir, outputFileName }) => {
    let outputPath = file;
    const inputPathFile = file.split('/').pop();

    if (/^http/i.test(file)) {
      const warning = `Unable to load ${inputPathFile} -> ${outputFileName}, checking cache...`;
      outputPath = joinPath(outputDir, outputFileName);

      try {
        const outputYaml = execSync(`curl --silent ${file}`);

        if (!existsSync(outputDir)) {
          mkdirSync(outputDir);
        }

        if (/openapi/i.test(outputYaml.toString())) {
          writeFileSync(outputPath, outputYaml);
        } else {
          console.warn(setColor(warning, 'yellow'));
        }
      } catch (e) {
        console.warn(setColor(warning, 'yellow'));
      }
    }

    if (existsSync(outputPath)) {
      console.log(setColor(`Success -> ${inputPathFile}`, 'green'));
      outputPaths.push({ file: outputPath, desc: inputPathFile });
    } else {
      console.warn(setColor(`Failed -> ${inputPathFile}`, 'red'));
    }
  });

  return outputPaths;
};

const fileContents = file => {
  if (!existsSync(file)) {
    return '';
  }

  // return readFileSync(file).toString();
  const output = execSync(`yaml2json ${file}`);
  // execSync(`yaml2json ${file} > ./spec.json`);
  const updatedOutput = output.toString();

  return { json: JSON.parse(updatedOutput), str: updatedOutput };
};

const parseRefs = (json, str) => {
  // const refs = str.match(/{\s"\$ref":\s"(#\/[\d\D])*.?"\s}/);
  // const refs = str.match(/"\$ref":"([\d\D])+?"/g);
  const replaceRefs = s =>
    s.replace(/"\$ref":"#([\d\D])+?"/g, match => {
      const path = match.split('#/')?.[1].split('"')?.[0].split('/');
      const val = _get(json, path, {});
      // console.log(val);
      return JSON.stringify(val).replace(/^{|}$/g, '');
    });

  const refs = replaceRefs(replaceRefs(replaceRefs(str)));

  writeFileSync(joinPath('./', 'updatedSpec.json'), refs);

  return JSON.parse(refs);

  // console.log(refs);

  /*
  const mapSpec = spec => {
    if (Array.isArray(spec)) {
      return spec.map(innerObj => mapSpec(innerObj));
    }

    try {
      Object.entries()
    }

    if (_isObject(spec)) {
      return mapSpec(spec);
    }

    return spec;
  };
   */
};

const [{ file }] = getApiSpec(spec);
// const { components = {}, info = {}, paths = {} } = fileContents(file);
const { json: jsonFile, str: stringFile } = fileContents(file);

const parsedRefs = parseRefs(jsonFile, stringFile);

console.log(parsedRefs);

// console.log('001 >>>>>>>>>>>>>>>>> contents', paths['/tally/products/{product_id}/{metric_id}']);
// console.log('001 >>>>>>>>>>>>>>>>> contents', JSON.stringify(components, null, 2));

// const joiTextObject = swaggerToJoi(paths['/tally/products/{product_id}/{metric_id}']);
// console.log('001 >>>>>>>>>>>>>>>>>>>', fileCont);
// const joiTextObject = swaggerToJoi({ ...fileCont, openapi: '3.0.0' });
// const joiTextObject = swaggerToJoi(fileCont.paths, fileCont.components);

const joiTextObject = swaggerToJoi(parsedRefs.paths, parsedRefs.components);

console.log('002 >>>>>>>>>>>>>>>>>>> text object', joiTextObject);
