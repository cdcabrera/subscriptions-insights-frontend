import React from 'react';
// import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import { useGetChartContext, useToggleData } from './chartContext';

const ChartLegend = () => {
  // const { chartLegend, dataSets } = useGetChartContext();
  const { chartSettings = {} } = useGetChartContext();
  const { getIsToggled, onHide, onRevert, onToggle } = useToggleData();

  const { chartLegend, dataSets } = chartSettings;

  console.log('>>> chartLegend', chartLegend, dataSets);

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
    (React.isValidElement(chartLegend) && React.cloneElement(chartLegend, { ...legendProps })) ||
    chartLegend({ ...legendProps })
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
