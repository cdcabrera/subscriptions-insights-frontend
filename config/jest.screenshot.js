// const EventEmitter = require('events');
const { exec, spawn } = require('child_process');
const { Worker } = require('worker_threads');
const { chromium } = require('playwright');
const { getServers, setup: setupDevServer, teardown: teardownDevServer } = require('jest-process-manager');
const sharp = require('sharp');

// const myEmitter = new EventEmitter();

const pollServer = (callback = Function.prototype, count = 5000) => {
  setTimeout(async () => {
    const servers = getServers();
    console.log('Polling servers...');

    if (servers.length) {
      pollServer(callback);
    } else {
      console.info('Server closed, running clean up.');
      await callback();
    }
  }, count);
};

// const child = spawn('bash', ['.'], { detached: true });
// child.on('exit', () => {
//  clearTimeout(timeout);
//  console.log('Stopped');
// });
/*
const pollNode = callback => {
  const worker = new Worker(__filename, {
    workerData: script
  });

  worker.on('exit', (code) => {
    if (code !== 0)
      reject(new Error(`Worker stopped with exit code ${code}`));
  });

  const timeout = setTimeout(async () => {
    const servers = getServers();
    console.log('Polling servers...');

    if (servers.length) {
      pollNode(callback);
    } else {
      console.info('Server closed, running clean up.');
      await callback();
    }
  }, 5000);
};
*/
const runService = WorkerData =>
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

/**
 * Spool up a development script.
 *
 * @param {object} params
 * @param {string} params.command
 * @param {number} params.port
 * @param {string} params.protocol
 * @param {number} params.launchTimeout
 * @param {boolean} params.debug
 * @param params.usedPortAction
 * @returns {void}
 */
const setServer = async ({
  command,
  port,
  protocol = 'http',
  launchTimeout = 60000,
  debug = false,
  usedPortAction = 'kill',
  ...params
} = {}) => {
  if (process.env._CAPTURE_SERVER) {
    return;
  }
  process.env._CAPTURE_SERVER = true;

  await setupDevServer({
    ...params,
    command,
    port,
    protocol,
    launchTimeout,
    debug,
    usedPortAction
  });

  // pollNode(async () => teardownDevServer());
  // await run().catch(err => console.error(err));

  /*
  // pollServer(async () => teardownDevServer());
  // spawnSync();
  exec('echo "hello world..."', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
   */
};

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

const closeCapture = async () => {
  pollJest(async () => teardownDevServer());
  /*
  const cleanUp = exitCode => {
    console.info('Jest closed, running clean up.', exitCode);
    teardownDevServer();
  };
  // process.on('SIGINT', cleanUp);
  // process.on('exit', cleanUp);
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach(eventType => {
    process.on(eventType, cleanUp.bind(null, { exit: true }));
  });
  */
};

const startCapture = async () => {
  await setServer({ command: 'yarn start', port: 3000 });
};

module.exports = {
  closeCapture,
  startCapture
};
