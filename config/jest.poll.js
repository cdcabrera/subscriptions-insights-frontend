/*
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
module.exports = function runService = WorkerData =>
  new Promise((resolve, reject) => {
    const worker = new Worker(__filename, { WorkerData });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
    });
  });

const run = async () => {
  const result = await runService('hello node.js');
  console.log(result);
};

await run().catch(err => console.error(err));

const pollJest = (callback = Function.prototype, count = 5000) => {
  setTimeout(async () => {
    console.log('Polling >>>>>>>>>>>>>>>>>>>', jest);

    if (jest) {
      pollJest(callback);
    } else {
      console.info('Jest closed, running clean up.');
      await callback();
    }
  }, count);
};
*/
const http = require('http');
const axios = require('axios');

const subscribeTest = async (path, callback = Function.prototype) => {
  // const response = await fetch(path);
  const request = http.request(path);
  request.end();

  request.on('error', response => {
    // console.log('>>>>> response', a?.statusCode)
    callback(response?.statusCode);
  });

  request.on('close', response => {
    // console.log('>>>>> response', a?.statusCode)
    callback(response?.statusCode);
  });

  request.on('response', response => {
    // console.log('>>>>> response', a?.statusCode)
    callback(response?.statusCode);
  });

  // request.on('information', a => {
  //  console.log('>>>>>>>>>>>> info', a);
  // });

  /*
  if (response.status === 502) {
    await subscribe(path, callback);
  } else if (response.status !== 200) {
    callback(response.statusText);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    await subscribe(path, callback);
  } else {
    const message = await response.text();
    callback(message);
    await subscribe(path, callback);
  }
  */
};
const timeoutFunctionCancel = (func, { timeout = 3000, errorMessage = 'function timeout' } = {}) => {
  let clearTimer;

  const timer = () =>
    new Promise((_, reject) => {
      clearTimer = setTimeout(reject, timeout, new Error(errorMessage));
    });

  const updatedFunc = async () => {
    const response = await func();
    clearTimeout(clearTimer);
    return response;
  };

  const execFunction = () =>
    Promise.race([timer(), updatedFunc()]).finally(() => {
      clearTimeout(clearTimer);
    });

  return execFunction();
};

const serverStatusEh = async (path, status = 200, { timeout = 120000 } = {}) => {
  const setup = new Promise(resolve => {
    setTimeout(() => resolve(200), 2000);
    /*
    const request = http.request(path);
    request.end();

    request.on('response', ({ statusCode }) => {
      if (statusCode === status) {
        request.removeListener('response');
        resolve(statusCode);
      }
    });
    */
  });

  return timeoutFunctionCancel(() => setup, { timeout });
};

const subscribe = async (path, callback = Function.prototype) => {
  // const response = await fetch(path);
  const response = await axios.get(path);

  if (response.status === 502) {
    await subscribe(path, callback);
  } else if (response.status !== 200) {
    callback(response.statusText);
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    await subscribe(path, callback);
  } else {
    const message = await response.text();
    callback(message);
    await subscribe(path, callback);
  }
};

module.exports = {
  subscribe
};
