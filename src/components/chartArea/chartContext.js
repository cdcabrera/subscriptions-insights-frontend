import React, { useState, useCallback, useContext } from 'react';
// import React from 'react';

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
const ChartContext = React.createContext({});

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
  */
};

const useChartSettings = () => {
  const obj = useContext(ChartContext);
  // const { context } = useChartContext();

  console.log('useChartSettings >>>', obj);
  const { chartSettings = {} } = obj || {};
  // const [context = {}] = useChartContext();
  // const { chartSettings = {} } = context;
  return chartSettings;
};

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

// const useContainerRef = () => useRef(null);
// const containerRef = useRef(null);
// const [ref, setRef] = useState(containerRef);

// const setRef = React.useCallback(ref => {
//  setContainerRef(ref);
// });

/*
return {
  ref,
  setRef
};
   */
// };
const context = {
  ChartContext,
  useChartContext,
  useChartSettings
};

export { context as default, context, ChartContext, useChartContext, useChartSettings };
