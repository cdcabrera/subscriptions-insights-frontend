const { join: joinPath } = require('path');
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const SwaggerParser = require('@apidevtools/swagger-parser');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerAPIs = [
  {
    file: 'https://raw.githubusercontent.com/RedHatInsights/rhsm-subscriptions/develop/api/rhsm-subscriptions-api-spec.yaml',
    outputDir: `${process.cwd()}/src/services/rhsm`,
    outputFileName: 'rhsmApi.json'
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
 * Load remote swagger/openapi docs, or on fail confirm a local version exists then use it.
 *
 * @param {object} options
 * @param {Array} options.files
 * @returns {*[]}
 */
const swaggerParser = ({ files = swaggerAPIs } = {}) => {
  const updatedFiles = [];

  files.forEach(async ({ file, outputDir, outputFileName }) => {
    let output = {};
    const inputPathFile = file.split('/').pop();
    const outputPath = joinPath(outputDir, outputFileName);

    try {
      const parser = new SwaggerParser();
      output = await parser.dereference(file);

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
      }

      writeFileSync(outputPath, JSON.stringify(output, null, 2));
    } catch (e) {
      const warning = `Unable to load ${inputPathFile} -> ${outputFileName}, checking cache...`;
      console.warn(setColor(warning, 'yellow'));
    }

    if (existsSync(outputPath)) {
      console.log(setColor(`Success -> ${outputFileName}`, 'green'));
      updatedFiles.push({ file: outputPath, desc: inputPathFile, content: output });
    } else {
      console.warn(setColor(`Failed -> ${inputPathFile} -> ${outputFileName}`, 'red'));
    }
  });

  return updatedFiles;
};

/**
 * Express serve remote API files.
 *
 * @param {object} options
 * @param {Array} options.files
 * @param {number} options.port
 */
const serveSwagger = ({ files = swaggerAPIs, port = 5050 } = {}) => {
  files.forEach(({ file: url, port: filePort = port, outputDir, outputFileName }) => {
    const file = joinPath(outputDir, outputFileName);

    if (existsSync(file)) {
      const app = express();

      app.use(
        `/curiosity/${outputFileName.split('.')[0]}`,
        swaggerUi.serve,
        swaggerUi.setup(null, { swaggerOptions: { url } })
      );

      app.listen(filePort, () => {
        console.log(
          `You can now view API docs for ${outputFileName} in the browser.\n  Open: http://localhost:${filePort}/docs/api\n`
        );
      });
    } else {
      console.warn(setColor(`${outputFileName} doesn't exist`, 'yellow'));
    }
  });
};

const checkSwagger = () => {};

switch (process.argv[2]?.toLowerCase()) {
  case 'serve':
    serveSwagger();
    break;
  case 'test':
    checkSwagger();
    break;
  default:
    swaggerParser();
}

module.exports = {
  setColor,
  serveSwagger,
  swaggerParser
};
