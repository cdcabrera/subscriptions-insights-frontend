import React, { useContext } from 'react';
import { helpers } from '../../common/helpers';

/**
 * @memberof GraphCardChartState
 * @module GraphCardStateContext
 */

/**
 * GraphCardState context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{ chartDataSets: [] }, helpers.noop];

const GraphCardChartStateContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated graph card context.
 *
 * @returns {React.Context<{}>}
 */
const useGraphCardStateChartContext = () => useContext(GraphCardChartStateContext);

const context = {
  GraphCardMetricTotalsContext: GraphCardChartStateContext,
  DEFAULT_CONTEXT,
  useGraphCardStateChartContext
};

export { context as default, context, GraphCardChartStateContext, DEFAULT_CONTEXT, useGraphCardStateChartContext };
