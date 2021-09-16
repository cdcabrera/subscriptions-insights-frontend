const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const swaggerToJoi = require('swagger-to-joi');
const SwaggerParser = require('@apidevtools/swagger-parser');
const enjoi = require('enjoi');
const Joi = require('joi');
const { fromJson } = require('json-joi-converter');

const openApiSpecs = [
  {
    file:
      'https://raw.githubusercontent.com/RedHatInsights/rhsm-subscriptions/main/api/rhsm-subscriptions-api-spec.yaml',
    outputDir: `${process.cwd()}/.openapi`,
    outputFileName: 'rhsm.yaml'
  }
];

// const joiTextObject = swaggerToJoi(openApiSpecs[0].file);
// console.log(joiTextObject);

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
const getLocalApiSpec = (inputPaths = []) => {
  const outputPaths = [];

  inputPaths.forEach(inputPath => {
    const { file, outputDir, outputFileName, ...props } = inputPath;
    let outputPath = file;
    let outputYaml = '';
    const inputPathFile = file.split('/').pop();

    if (/^http/i.test(file)) {
      const updating = `Loading -> ${inputPathFile}...`;
      const warning = `Unable to load ${inputPathFile} -> ${outputFileName}, checking cache...`;
      outputPath = path.join(outputDir, outputFileName);

      try {
        console.info(setColor(updating, 'blue'));
        outputYaml = execSync(`curl --silent ${file}`);

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }

        if (/openapi/i.test(outputYaml.toString())) {
          fs.writeFileSync(outputPath, outputYaml);
        } else {
          console.warn(setColor(warning, 'yellow'));
        }
      } catch (e) {
        console.warn(setColor(warning, 'yellow'));
      }
    }

    if (fs.existsSync(outputPath)) {
      console.log(setColor(`Success -> ${inputPathFile}`, 'green'));
      outputPaths.push({
        file: outputPath,
        outputDir,
        desc: inputPathFile,
        contents: outputYaml?.toString(),
        ...props
      });
    } else {
      console.warn(setColor(`Failed -> ${inputPathFile}`, 'red'));
    }
  });

  return outputPaths;
};

const generateJSON = async file => SwaggerParser.bundle(file);

const generateJoi = (files = []) => {
  files.forEach(async ({ file, outputDir }) => {
    const all = await generateJSON(file);

    console.log('>>>>', fromJson(JSON.stringify(all, null, 2)));

    // fs.writeFileSync(path.join(outputDir, 'rhsm.json'), JSON.stringify(all, null, 2));
    // const { components } = await generateJSON(file);
    // console.log(components.schemas.TallyReport.properties.meta.properties);

    // const joi = swaggerToJoi(components);
    // console.log(Object.keys(components.schemas.TallyReport));

    // const schema = enjoi.schema(components.schemas.GranularityType);
    // const schema = enjoi.schema(components.schemas.TallySnapshot);
    /*
    const schema = enjoi.schema(all, {
      subSchemas: {

      },
      extensions: [
        // {
          // type: 'double',
          // base: Joi.number()
        // },
        // {
          // type: 'enum',
          // base: Joi.string()
        // }
      ]
    });
    */
    // console.log(schema);
    // console.log(joi);
    // console.log(JSON.stringify(components));

    // console.log(schema.validate({ date: '2017-08-08T17:32:01Z', instance_count: '5', corehours: '10' }));
    /*
    const { error, value } = schema.validate({
      // data: [{ date: '2017-08-08T17:32:01Z', instance_count: '5', corehours: '10' }],
      links: {
        first: 'some path',
        last: 'some path'
      },
      meta: {
        count: 10
        // product: 'test'
        // product: {},
        // granularity: {}
      }
    });
    */

    // console.log('>>>>>>>>', error, value);

    /*
    console.log(
      // JSON.stringify(
        schema.validate({
          data: [{ date: '2017-08-08T17:32:01Z', instance_count: '5', corehours: '10' }],
          links: {
            first: 'some path',
            last: 'some path'
          },
          meta: {
            count: 10
            // product: 'test'
            // product: {},
            // granularity: {}
          }
        })
      // )
    );
     */
  });
};

/*
{
  function* gen() {
    const a = yield SwaggerParser.bundle(file);
    console.log('a>>>>', a);
    return a;
  }

  const iterator = gen();

  return iterator.next();
  /*
  // await SwaggerParser.bundle(file, {});
  const what = await SwaggerParser.bundle(file);
  console.log
  return what;
  */
/*
// const out = v => v;
let work;
SwaggerParser.bundle(file, {}, (_, output) => {
  // Promise.resolve(output);
  // out(output);
  work = output;
});
return work;
*/

// console.log();
// const [spec] = getLocalApiSpec(openApiSpecs);
const specs = getLocalApiSpec(openApiSpecs);
// const results = generateJSON(spec);

// results.then(r => console.log('hey', r));
generateJoi(specs);

// const JSON =

/*
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openApiSpecs = [
  {
    file:
      'https://raw.githubusercontent.com/RedHatInsights/rhsm-subscriptions/main/api/rhsm-subscriptions-api-spec.yaml',
    outputDir: `${process.cwd()}/.openapi`,
    outputFileName: 'rhsm.yaml',
    port: 5050
  }
];
const cache = {
  tryAgainCount: 0
};

/**
 * Set display colors
 *
 * @param {string} str
 * @param {string} color
 * @returns {string}
 * /
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
 * Express serve local files
 *
 * @param {Array} files
 * /
const serveDocs = (files = []) => {
  files.forEach(yamlFile => {
    if (fs.existsSync(yamlFile.file)) {
      const app = express();

      app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(YAML.load(yamlFile.file)));

      app.listen(yamlFile.port, () => {
        console.log(
          `You can now view API docs for ${yamlFile.desc} in the browser.\n  Open: http://localhost:${yamlFile.port}/docs/api\n`
        );
      });
    } else if (cache.tryAgainCount < 10) {
      setTimeout(() => {
        console.info(`Locating ${yamlFile.desc}...`);
        cache.tryAgainCount += 1;
        serveDocs(yamlFile.file, yamlFile.port);
      }, 1000);
    } else {
      console.warn(setColor(`${yamlFile.desc} doesn't exist`, 'yellow'));
    }
  });
};

/**
 * Load remote files and cache, or just confirm a local file.
 *
 * @param {Array} inputPaths
 * @returns {Array}
 * /
const getLocalApiSpec = (inputPaths = []) => {
  const outputPaths = [];

  inputPaths.forEach(inputPath => {
    let outputPath = inputPath.file;
    const inputPathFile = inputPath.file.split('/').pop();

    if (/^http/i.test(inputPath.file)) {
      const warning = `Unable to load ${inputPathFile} -> ${inputPath.outputFileName}, checking cache...`;
      outputPath = path.join(inputPath.outputDir, inputPath.outputFileName);

      try {
        const outputYaml = execSync(`curl --silent ${inputPath.file}`);

        if (!fs.existsSync(inputPath.outputDir)) {
          fs.mkdirSync(inputPath.outputDir);
        }

        if (/openapi/i.test(outputYaml.toString())) {
          fs.writeFileSync(outputPath, outputYaml);
        } else {
          console.warn(setColor(warning, 'yellow'));
        }
      } catch (e) {
        console.warn(setColor(warning, 'yellow'));
      }
    }

    if (fs.existsSync(outputPath)) {
      console.log(setColor(`Success -> ${inputPathFile}`, 'green'));
      outputPaths.push({ file: outputPath, port: inputPath.port, desc: inputPathFile });
    } else {
      console.warn(setColor(`Failed -> ${inputPathFile}`, 'red'));
    }
  });

  return outputPaths;
};

serveDocs(getLocalApiSpec(openApiSpecs));
*/
