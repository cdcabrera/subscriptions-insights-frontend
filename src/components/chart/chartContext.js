import React, { useCallback, useContext, useEffect, useState } from 'react';
import { helpers } from '../../common';

/**
 * @memberof Chart
 * @module ChartContext
 */

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
 * Centralized chart component mutated dataSets for callbacks outside of chart context.
 * Currently, exposes legend toggle, add mutations as necessary.
 *
 * @param {object} options
 * @param {useChartContext} [options.useChartContext=useChartContext]
 * @returns {Array<objects>}
 */
const useDataSets = ({ useChartContext: useAliasChartContext = useChartContext } = {}) => {
  const { chartSettings = {}, dataSetsToggle: contextDataSetsToggle = [] } = useAliasChartContext();
  const { dataSets, onUpdate } = chartSettings;
  const [dataSetsToggle] = contextDataSetsToggle;
  const [updatedDataSets, setUpdatedDataSets] = useState(dataSets);

  useEffect(() => {
    setUpdatedDataSets(prevDataState =>
      prevDataState.map(prevDataSet => ({
        ...prevDataSet,
        isDisplayed: !dataSetsToggle[prevDataSet.id]
      }))
    );
  }, [onUpdate, dataSets, dataSetsToggle]);

  useEffect(() => {
    const updatedDatum = helpers.memoClone(updatedDataSets);
    onUpdate.call(null, { datum: updatedDatum });
  }, [onUpdate, updatedDataSets]);

  return updatedDataSets;
};

/**
 * Track, show, and hide chart data layers.
 *
 * @fires onHide
 * @fires onRevert
 * @fires onToggle
 * @param {object} options
 * @param {Function} options.useChartContext
 * @returns {{onRevert: Function, onToggle: Function, getIsToggled: Function, dataSetsToggle: object,
 *     onHide: Function}}
 */
const useToggleData = ({ useChartContext: useAliasChartContext = useChartContext } = {}) => {
  const { dataSetsToggle: contextDataSetsToggle = [] } = useAliasChartContext();
  const [dataSetsToggle, setDataSetsToggle] = contextDataSetsToggle;

  /**
   * Hide a graph layer.
   *
   * @event onHide
   */
  const onHide = useCallback(
    id => {
      setDataSetsToggle(prevState => ({ ...prevState, [id]: true }));
    },
    [setDataSetsToggle]
  );

  /**
   * Reset graph layers.
   *
   * @event onRevert
   */
  const onRevert = useCallback(() => {
    setDataSetsToggle(() => ({}));
  }, [setDataSetsToggle]);

  /**
   * Hide/show graph layers.
   *
   * @event onToggle
   * @returns boolean;
   */
  const onToggle = useCallback(
    id => {
      const updatedToggle = !dataSetsToggle?.[id];
      setDataSetsToggle(prevState => ({ ...prevState, [id]: updatedToggle }));
      return updatedToggle;
    },
    [dataSetsToggle, setDataSetsToggle]
  );

  /**
   * Graph layer status.
   *
   * @callback getIsToggled
   * @returns boolean|*
   */
  const getIsToggled = useCallback(id => dataSetsToggle?.[id] || false, [dataSetsToggle]);

  const getAllToggled = useCallback(() => dataSetsToggle, [dataSetsToggle]);

  return {
    ...{ dataSetsToggle },
    getAllToggled,
    onHide,
    onRevert,
    onToggle,
    getIsToggled
  };
};

const context = {
  ChartContext,
  DEFAULT_CONTEXT,
  useChartContext,
  useDataSets,
  useToggleData
};

export { context as default, context, ChartContext, DEFAULT_CONTEXT, useChartContext, useDataSets, useToggleData };
