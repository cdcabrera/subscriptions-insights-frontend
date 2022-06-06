// const { startCapture, closeCapture } = require('./jest.screenshot');
const { execSync } = require('child_process');

const serverWait = (path, { pollTimer = 15000, attempts = 10, isUnlimited = true } = {}) =>
  new Promise((resolve, reject) => {
    const updatedAttempts = attempts - 1;

    if (!isUnlimited && updatedAttempts <= 0) {
      reject(new Error(`Read server failed, ${path}`));
    }

    setTimeout(async () => {
      try {
        const headers = execSync(`curl -I --silent ${path}`);

        if (headers) {
          resolve(headers);
        } else {
          serverWait(path, { pollTimer, attempts: updatedAttempts });
        }
      } catch (e) {
        reject(e);
      }
    }, pollTimer);
  });

const pollJest = (callback = Function.prototype, count = 15000) => {
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

const start = async () => {
  await serverWait('http://localhost:3000/insights/subscriptions/');
  pollJest(() => );
};

module.exports = async () => {
  // await startCapture();
  // await closeCapture();
  await start();
};
