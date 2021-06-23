import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { useGetChartContext, useToggleData } from './chartContext';

const ChartLegend = () => {
  const { getIsToggled, onHide, onRevert, onToggle } = useToggleData();
  const { chartSettings = {} } = useGetChartContext();
  const { chartLegend, dataSets } = chartSettings;

  if (!chartLegend) {
    return null;
  }

  const legendProps = {
    datum: { dataSets: _cloneDeep(dataSets) },
    chart: {
      hide: onHide,
      revert: onRevert,
      toggle: onToggle,
      isToggled: getIsToggled
    }
  };

  return (
    <div className="curiosity-chartarea__legend">
      {(React.isValidElement(chartLegend) && React.cloneElement(chartLegend, { ...legendProps })) ||
        chartLegend({ ...legendProps })}
    </div>
  );
};

/**
 * Prop types.
 */
ChartLegend.propTypes = {
  // chartLegend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  // dataSets: PropTypes.array,
};

/**
 * Default props.
 */
ChartLegend.defaultProps = {
  // chartTooltip: null,
  // dataSets: []
};

export { ChartLegend as default, ChartLegend };
