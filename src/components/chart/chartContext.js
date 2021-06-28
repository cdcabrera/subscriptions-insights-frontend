import React, { useCallback, useContext } from 'react';
import { helpers } from '../../common';

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [
  { chartContainerRef: helpers.noop, chartSettings: {}, chartTooltipRef: helpers.noop, dataSetsToggle: [] },
  helpers.noop
];

const ChartContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated chart context.
 *
 * @returns {React.Context<{}>}
 */
const useChartContext = () => useContext(ChartContext);

/**
 * Track, show, and hide chart data layers.
 *
 * @returns {{onRevert: Function, onToggle: Function, getIsToggled: Function, dataSetsToggle: object,
 *     onHide: Function}}
 */
const useToggleData = () => {
  const { dataSetsToggle: contextDataSetsToggle = [] } = useChartContext();
  const [dataSetsToggle, setDataSetsToggle] = contextDataSetsToggle;

  /**
   * Hide a graph layer.
   *
   * @type {(function(*): void)|*}
   */
  const onHide = useCallback(
    id => {
      setDataSetsToggle(prevState => ({ ...prevState, [id]: true }));
    },
    [setDataSetsToggle]
  );

  // ToDo: re-evaluate useCallback here.
  /**
   * Reset graph layers.
   *
   * @type {(function(): void)|*}
   */
  const onRevert = useCallback(() => {
    setDataSetsToggle(() => ({}));
  }, [setDataSetsToggle]);

  /**
   * Hide/show graph layers.
   *
   * @type {function(*): boolean}
   */
  const onToggle = useCallback(
    id => {
      const updatedToggle = !dataSetsToggle[id];
      setDataSetsToggle(prevState => ({ ...prevState, [id]: updatedToggle }));
      return updatedToggle;
    },
    [dataSetsToggle, setDataSetsToggle]
  );

  // ToDo: review return undefined if doesn't exist
  /**
   * Graph layer status.
   *
   * @type {function(*): boolean}
   */
  const getIsToggled = useCallback(id => dataSetsToggle?.[id] || false, [dataSetsToggle]);

  return {
    ...{ dataSetsToggle },
    onHide,
    onRevert,
    onToggle,
    getIsToggled
  };
};

export { ChartContext as default, ChartContext, DEFAULT_CONTEXT, useChartContext, useToggleData };
