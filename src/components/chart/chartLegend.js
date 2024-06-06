import React from 'react';
import PropTypes from 'prop-types';
import { useChartContext, useDataSets, useToggleData } from './chartContext';
import { helpers } from '../../common';

/**
 * @memberof Chart
 * @module ChartLegend
 */

/**
 * Wrapper for rendering an HTML based legend.
 *
 * @param {object} options
 * @param {Function} options.useChartContext
 * @param {Function} options.useDataSets
 * @param {Function} options.useToggleData
 * @returns {React.ReactNode}
 */
const ChartLegend = ({
  useChartContext: useAliasChartContext,
  useDataSets: useAliasDataSets,
  useToggleData: useAliasToggleData
} = {}) => {
  const { chartSettings = {} } = useAliasChartContext();
  const { chartLegend, padding = {}, xAxisProps = {} } = chartSettings;
  const updatedDataSets = useAliasDataSets();
  const { dataSetsToggle, getIsToggled, onHide, onRevert, onToggle } = useAliasToggleData();

  if (!chartLegend) {
    return null;
  }

  const legendProps = {
    datum: { dataSets: helpers.memoClone(updatedDataSets) },
    chart: {
      dataSetsToggle,
      hide: onHide,
      revert: onRevert,
      toggle: onToggle,
      isToggled: getIsToggled
    }
  };

  return (
    <div
      className={`curiosity-chartarea__legend${(xAxisProps?.label && '-axis-label-active') || ''}`}
      style={{
        marginLeft: (padding?.left && `${padding.left}px`) || 0,
        marginRight: (padding?.right && `${padding.right}px`) || 0
      }}
    >
      {(React.isValidElement(chartLegend) && React.cloneElement(chartLegend, { ...legendProps })) ||
        chartLegend({ ...legendProps })}
    </div>
  );
};

/**
 * Prop types.
 */
ChartLegend.propTypes = {
  useChartContext: PropTypes.func,
  useDataSets: PropTypes.func,
  useToggleData: PropTypes.func
};

/**
 * Default props.
 */
ChartLegend.defaultProps = {
  useChartContext,
  useDataSets,
  useToggleData
};

export { ChartLegend as default, ChartLegend };
