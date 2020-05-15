import React from 'react';
import PropTypes from 'prop-types';
import c3 from 'c3';
import _isEqual from 'lodash/isEqual';
import { helpers } from '../../common';

/**
 * C3 wrapper.
 * Uses aspects from https://github.com/bcbcarl/react-c3js and https://github.com/wuct/react-c3-component
 *
 * @augments React.Component
 */
class C3Chart extends React.Component {
  state = { chart: null };

  node = React.createRef();

  componentDidMount() {
    this.generateChart();
  }

  componentDidUpdate(prevProps) {
    const { config } = this.props;

    if (!_isEqual(prevProps.config.data, config.data)) {
      this.generateChart(true);
    }
  }

  componentWillUnmount() {
    const { chart } = this.state;
    chart.destroy();
    this.setState({ chart: null });
  }

  generateChart(isUpdating) {
    const { chart } = this.state;
    const { config, onComplete } = this.props;

    let updatedChart = chart;
    if (!updatedChart) {
      updatedChart = c3.generate({ bindto: this.node.current, ...config });
    }

    this.setState({ chart: updatedChart }, () => {
      // if (config.unloadBeforeLoad) {
      //  updatedChart.unload();
      // updatedChart.destroy();
      // }
      if (isUpdating) {
        updatedChart.load({
          ...config.data,
          unload: config.unloadBeforeLoad || false,
          done: async () => {
            if (config.done) {
              await config.done({ chart: updatedChart });
            } else {
              await onComplete({ chart: updatedChart });
            }
          }
        });
      }
    });
  }

  render() {
    const { chart } = this.state;
    const { className, children, style } = this.props;

    return (
      <div className={`curiosity-c3chart ${className}`} style={style}>
        <div ref={this.node} className="curiosity-c3chart-container" />
        {chart && (
          <div className="curiosity-c3chart-description">
            {(typeof children === 'function' && children({ chart })) || children}
          </div>
        )}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{config: object}}
 */
C3Chart.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  config: PropTypes.shape({
    unloadBeforeLoad: PropTypes.bool,
    data: PropTypes.object,
    done: PropTypes.func
  }),
  onComplete: PropTypes.func,
  style: PropTypes.object
};

/**
 * Default props.
 *
 * @type {{config: {}}}
 */
C3Chart.defaultProps = {
  children: null,
  className: null,
  config: {},
  onComplete: helpers.noop,
  style: {}
};

export { C3Chart as default, C3Chart };
