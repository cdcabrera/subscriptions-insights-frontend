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

const useSetToggleData = () => {
  const [dataSetsToggle, setDataSetsToggle] = useState({});

  const updateDataSetsToggle = useCallback(dataSets => {
    console.log('TOGGLE 001 >>>', dataSets);
    setDataSetsToggle(dataSets);
  }, []);

  return [dataSetsToggle, updateDataSetsToggle];
};

/*
const useGetToggleData = () => {
  const { dataSetsToggle = [] } = useGetChartContext();
  return dataSetsToggle[0];
};
 */

/**
 * Track, show, and hide chart data layers.
 *
 * @returns {{onRevert: Function, onToggle: Function, getIsToggled: Function, dataSetsToggle: object,
 *     onHide: Function}}
 */
const useToggleData = () => {
  // const [dataSetsToggle, setDataSetsToggle] = useSetToggleData();
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
  const getIsToggled = useCallback(id => dataSetsToggle[id] || false, [dataSetsToggle]);
  // const getIsToggled = useCallback(id => (id && dataSetsToggle[id]) || dataSetsToggle, [dataSetsToggle]);

  const updatedDataSetsToggled = { dataSetsToggle };

  console.log('TOGGLE 002 >>>', dataSetsToggle);

  return {
    ...updatedDataSetsToggled,
    onHide,
    onRevert,
    onToggle,
    getIsToggled
  };
};

/*
const useChartContext = () => {
  const chartContext = useContext(ChartContext);
  const [context, doit] = useState(null);
  // const [context, setContext] = useState({});
  const callback = useCallback(
    settings => {
      doit(settings);
      console.log('DO IT >>>', doit);
      console.log('DO IT >>> settings', settings);
      console.log('DO IT 2 >>>', context);
      console.log('DO IT 3 >>>', chartContext);
    },
    [doit, context, chartContext]
  );

  // const doit = [context, callback];
  // return [...doit];
  return {
    context,
    callback
  };

  // eturn [context, callback];
  // return {
  //  context,
  //  setContext: callback
  // };

  /*
  const chartContext = useContext(ChartContext);
  const [context, setContext] = useState(chartContext);
  // const callback = obj => setContext(obj);
  const callback = useCallback(
    obj => {
      setContext(obj);
    },
    [setContext]
  );

  return [context, callback];
  * /
};
*/
/*
const useChartSettings = () => {
  const obj = useContext(ChartContext);
  // const { context } = useChartContext();

  console.log('useChartSettings >>>', obj);
  const { chartSettings = {} } = obj || {};
  // const [context = {}] = useChartContext();
  // const { chartSettings = {} } = context;
  return chartSettings;
};
 */

/*
const useChartData = () => {
  // const [data, setData] = useState({});
  const [toggledData, setToggledData] = useState({});
  const {} = React.useContext(ProductContext) || {};

  return {
    data: toggledData,
    setData: setToggledData
  };
};
*/

const context = {
  ChartContext,
  useGetChartContext,
  useSetChartContext,
  // useGetToggleData,
  useSetToggleData,
  useToggleData
};

export {
  context as default,
  context,
  ChartContext,
  useGetChartContext,
  useSetChartContext,
  // useGetToggleData,
  useSetToggleData,
  useToggleData
};
