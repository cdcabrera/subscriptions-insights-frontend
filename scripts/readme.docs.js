const { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('fs');
const { createHash } = require('crypto');
const { extname, join, resolve } = require('path');
const { globSync } = require('glob');
const jsdoc2md = require('jsdoc-to-markdown');

/**
 * Generate a temporary fixture from string literals. Borrowed from @cdcabrera/changelog-light npm
 *
 * @param {string} contents
 * @param {object} options
 * @param {string} options.dir
 * @param {string} options.ext
 * @param {string} options.encoding
 * @param {string} options.filename
 * @param {boolean} options.resetDir
 * @returns {{path: string, file: string, contents: *, dir: string}}
 */
const generateFixture = (
  contents,
  { dir = resolve(__dirname, '.fixtures'), ext = 'txt', encoding = 'utf8', filename, resetDir = true } = {}
) => {
  const updatedFileName = filename || createHash('md5').update(contents).digest('hex');
  const file = extname(updatedFileName) ? updatedFileName : `${updatedFileName}.${ext}`;
  const path = join(dir, file);

  if (resetDir && existsSync(dir)) {
    rmSync(dir, { recursive: true });
  }

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(path, contents, { encoding });
  const updatedContents = readFileSync(path, { encoding });

  return { dir, file, path, contents: updatedContents };
};

const generateReadMe = ({ input, output } = {}) => {
  const inputList = globSync(input);
  inputList.sort((a, b) => a.localeCompare(b));
  const updatedInputList = inputList.map(file => {
    if (/\.(ts|tsx)$/.test(file)) {
      /*
       * generateFixture
       * console.log('>>>>>>>>>>>>>', file);
       */
      const fileContents = readFileSync(file, { encoding: 'utf8' });
      const fileName = file
        .split('/')
        .pop()
        .replace(/\.(ts|tsx)$/, '.js');

      console.log('>>>>>> fileName', fileName);

      const { path: fixtureFile } = generateFixture(fileContents, {
        filename: fileName,
        ext: 'js',
        resetDir: false
      });

      console.log('>>>>>> path', fixtureFile);

      // const { path: fixtureFile } = generateFixture(fileContents, { ext: 'js', resetDir: false });
      return fixtureFile;
    }
    return file;
  });

  console.log('>>>>>>>>>>', updatedInputList);

  try {
    const outputPath = join(process.cwd(), output);
    const docs = jsdoc2md.renderSync({ files: updatedInputList, 'no-gfm': true });
    writeFileSync(outputPath, docs);
    console.info(`Generate README success > ${input}`);
  } catch (e) {
    console.warn(`Generate README failed > ${input} > `, e.message);
  }
};

((files = []) => {
  Promise.all(files.map(obj => generateReadMe(obj)));
})([
  { input: './src/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/README.md' },
  { input: './src/common/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/common/README.md' },
  { input: './src/components/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/components/README.md' },
  { input: './src/config/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/config/README.md' },
  { input: './src/hooks/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/hooks/README.md' },
  { input: './src/redux/**/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/redux/README.md' },
  { input: './src/services/**/**/!(*.test|*.spec).@(js|jsx|ts|tsx)', output: './src/services/README.md' }
]);
