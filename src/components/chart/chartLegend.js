import React from 'react';
import { useChartContext, useDataSets, useToggleData } from './chartContext';
import { helpers } from '../../common';

/**
 * @memberof Chart
 * @module ChartLegend
 */

/**
 * Wrapper for rendering an HTML based legend.
 *
 * @param {object} props
 * @param {useChartContext} [props.useChartContext=useChartContext]
 * @param {useDataSets} [props.useDataSets=useDataSets]
 * @param {useToggleData} [props.useToggleData=useToggleData]
 * @returns {JSX.Element|null}
 */
const ChartLegend = ({
  useChartContext: useAliasChartContext = useChartContext,
  useDataSets: useAliasDataSets = useDataSets,
  useToggleData: useAliasToggleData = useToggleData
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

export { ChartLegend as default, ChartLegend };
