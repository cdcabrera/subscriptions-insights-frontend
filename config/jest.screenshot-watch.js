class MyWatchPlugin {
  // Add hooks to Jest lifecycle events
  apply(jestHooks) {
    jestHooks.onTestRunComplete(results => {
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>', results);
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>', jestHooks);
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>', JSON.stringify(jestHooks));
    });
  }

  // Get the prompt information for interactive plugins
  // getUsageInfo(globalConfig) {}

  // Executed when the key from `getUsageInfo` is input
  // run(globalConfig, updateConfigAndRun) {}
}

module.exports = MyWatchPlugin;
