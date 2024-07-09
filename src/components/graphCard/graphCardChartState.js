import React, { useMemo, useState } from 'react';
import { GraphCardMetricTotals } from './graphCardMetricTotals';
import { GraphCardChart } from './graphCardChart';
import { GraphCardChartStateContext } from './graphCardChartStateContext';

/**
 * Wrapper for providing up-to-date internal state/context for graphCard components.
 *
 * @see Charts
 * @memberof Components
 * @module GraphCardState
 * @property {module} GraphCardStateContext
 */

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @returns {React.ReactNode}
 */
const GraphCardChartState = () => {
  const [context, setContext] = useState();
  const contextValue = useMemo(() => [context, setContext], [context, setContext]);

  return (
    <GraphCardChartStateContext.Provider value={contextValue}>
      <GraphCardMetricTotals>
        <GraphCardChart />
      </GraphCardMetricTotals>
    </GraphCardChartStateContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{}}
 */
GraphCardChartState.propTypes = {};

/**
 * Default props.
 *
 * @type {{}}
 */
GraphCardChartState.defaultProps = {};

export { GraphCardChartState as default, GraphCardChartState };
