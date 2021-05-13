import React, { useCallback, useContext, useState } from 'react';
import { helpers } from '../../common';

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [
  { chartContainerRef: helpers.noop, chartSettings: {}, chartTooltipRef: helpers.noop },
  helpers.noop
];

const ChartContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated chart context.
 *
 * @returns {React.Context<{}>}
 */
const useGetChartContext = () => useContext(ChartContext);

/**
 * Set chart context.
 *
 * @returns {Array}
 */
const useSetChartContext = () => {
  const chartContext = useContext(ChartContext);
  const [context, setContext] = useState(chartContext);

  const updateContext = useCallback(settings => {
    setContext(settings);
  }, []);

  return [context, updateContext];
};

/**
 * Track, show, and hide chart data layers.
 *
 * @returns {{onRevert: Function, onToggle: Function, getIsToggled: Function, dataSetsToggle: object,
 *     onHide: Function}}
 */
const useToggleData = () => {
  const { dataSetsToggle: contextDataSetsToggle = [] } = useGetChartContext();
  const [dataSetsToggle, setDataSetsToggle] = contextDataSetsToggle;

  const onHide = useCallback(
    id => {
      setDataSetsToggle({ ...dataSetsToggle, [id]: true });
    },
    [dataSetsToggle, setDataSetsToggle]
  );

  const onRevert = useCallback(() => {
    setDataSetsToggle({});
  }, [setDataSetsToggle]);

  const onToggle = useCallback(
    id => {
      const updatedToggle = !dataSetsToggle[id];
      setDataSetsToggle({ ...dataSetsToggle, [id]: updatedToggle });
      return updatedToggle;
    },
    [dataSetsToggle, setDataSetsToggle]
  );

  // ToDo: review return undefined if doesn't exist
  const getIsToggled = useCallback(id => dataSetsToggle?.[id] || false, [dataSetsToggle]);

  return {
    ...{ dataSetsToggle },
    onHide,
    onRevert,
    onToggle,
    getIsToggled
  };
};

const context = {
  ChartContext,
  useGetChartContext,
  useSetChartContext,
  useToggleData
};

export { context as default, context, ChartContext, useGetChartContext, useSetChartContext, useToggleData };
