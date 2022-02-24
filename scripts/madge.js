const madge = require('madge');
const path = require('path');
const dependencyTree = require('dependency-tree');
const _isPlainObject = require('lodash/isPlainObject');
const { execSync } = require('child_process');
// const mermaidLib = require('mermaid-cli/lib/index');

const tempFile = (contents, { dir = './.madge', file = 'temp.txt' } = {}) => {
  const filePath = `${dir}/${file}`;
  const stdout = execSync(`mkdir -p ${dir}; echo "${contents}" > ${filePath}`);
  return { dir, filePath, stdout };
};

const doIt = async () => madge(path.resolve(__dirname, '..', 'src'), { excludeRegExp: [/\.archive/, /__tests__/] });

const altDoIt = async () =>
  dependencyTree({
    filename: path.resolve(__dirname, '..', 'src', 'app.js'),
    directory: path.resolve(__dirname, '..', 'src')
  });
// .then(res => {
//  console.log(res.obj());
// })
// .then(res => res.svg())
// .then(output => {
//  console.log(output.toString());
// });
// .then(res => res.image('image.png'))
// .then(writtenImagePath => {
//  console.log(`Image written to ${writtenImagePath}`);
// });
const readObj = obj => {
  if (Array.isArray(obj)) {
    return obj.map(camelCase);
  }

  if (_isPlainObject(obj)) {
    const updatedObj = {};

    Object.entries(obj).forEach(([key, val]) => {
      updatedObj[_camelCase(key)] = camelCase(val);
    });

    return updatedObj;
  }

  return obj;
};

(async () => {
  const { tree } = await doIt();
  // const m = await altDoIt();
  // console.log('>>>>>>>>>>>', JSON.stringify(m));
  // console.log('>>>>>>>>>>>', tree);
  const merman = [`stateDiagram`];

  Object.entries(tree).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(subvalue => {
        merman.push(`${key} --> ${subvalue}`);
      });
    }
  });

  // console.log(merman.join(`\n`));
  // const testing = mermaidLib.process([], { version: true });

  let output = execSync('node ./scripts/mermaid.js --version');

  // const output = execSync(`
  //  cat << EOF | ./scripts/mermaid.js
  //    ${merman.join('\n\t')}
  //  EOF
  // `);
  const { filePath } = tempFile(merman.join('\n\t\t'), { file: 'temp.mmd' });
  output = execSync(`node ./scripts/mermaid.js ${filePath} -o ./scripts/output.svg`);
  // output = execSync(`node ./scripts/mermaid.js -h`);

  // const output = execSync(`node ./scripts/mermaid.js -i ${filePath} -o ./output.svg`);

  console.log('>>>>', output.toString());
})();
