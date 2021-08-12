const fs = require('fs-extra');
const { watch } = require('chokidar');

/**
 * FixMe: Watch and copy. Replacement for "copy-webpack-plugin" during development.
 * "copy-webpack-plugin" works adequately for build output, but during development if webpack fails
 * to compile it's prone to errors and potentially "NOT copying" files after a webpack compile failure.
 * This update makes use of "chokidar" and "fs-extra" and provides a more consistent experience. We'll
 * revisit "copy-webpack-plugin" if/when it's updated.
 */
/* Watch and copy files.
 * ref, https://github.com/xdoer/webpack-plugin-chokidar
 *
 * @param {object} options
 * @param {Array} options.config
 * @param {object} options.config.options
 * @param {string} options.config.options.from
 * @param {string} options.config.options.to
 * @param {string} options.from
 * @param {string} options.to
 */
class DevCopyPlugin {
  constructor(options = {}) {
    this.initialCopy = [];
    this.options = options;
    this.pluginName = 'DevCopyPlugin';
    this.stats = undefined;
    this.updatedConfig = [];

    this.setupConfig();
  }

  /**
   * Set configuration.
   */
  setupConfig() {
    const { options, pluginName } = this;
    const { config = [], from, to } = options;
    const updatedConfig = [];
    const updatedInitialCopy = [];

    const observer = (updatedFrom, updatedTo) => () => {
      console.info(`${pluginName}:\n\tfrom ${updatedFrom}\n\tto ${updatedTo}`);
      fs.copySync(updatedFrom, updatedTo);
    };

    if (from && to) {
      updatedConfig.push({
        from,
        to,
        opt: {
          persistent: true
        },
        actions: {
          on: {
            all: observer(from, to)
          }
        }
      });
    }

    if (config.length) {
      const updatedOptionsConfig = config.map(({ from: configFrom, to: configTo }) => ({
        from: configFrom,
        to: configTo,
        opt: {
          persistent: true
        },
        actions: {
          on: {
            all: observer(configFrom, configTo)
          }
        }
      }));
      updatedConfig.push(...updatedOptionsConfig);
    }

    updatedInitialCopy.push(
      ...updatedConfig.map(({ from: passedFrom, to: passedTo }) => observer(passedFrom, passedTo))
    );

    this.initialCopy = updatedInitialCopy;
    this.updatedConfig = updatedConfig;
  }

  /**
   * Webpack plugin default method.
   *
   * @param {*|object} compiler
   */
  apply(compiler) {
    const { initialCopy, pluginName, updatedConfig } = this;
    const fileWatchers = [];

    updatedConfig.forEach(({ from, opt, actions }) => {
      if (!actions || !Object.keys(actions).length) {
        return;
      }

      // create watch instance
      const watcher = watch(from, { ...opt });

      // add listener
      Object.entries(actions).forEach(action => {
        const [listen, callbacks] = action;

        Object.entries(callbacks).forEach(([key, value]) => {
          fileWatchers.push(() => {
            watcher[listen](key, (...args) => {
              value(...args);

              if (this.stats) {
                compiler.hooks.done.callAsync(this.stats, () => {});
              }
            });
          });
        });
      });
    });

    compiler.hooks.done.tap(pluginName, stats => {
      this.stats = stats;
    });

    compiler.hooks.afterEmit.tapAsync(pluginName, (_, callback) => {
      initialCopy.forEach(func => func());
      fileWatchers.forEach(func => func());
      callback();
    });
  }
}

const devCopyPlugin = options => new DevCopyPlugin(options);

module.exports = devCopyPlugin;
