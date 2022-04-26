import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common';
import { GraphCardMetricTotals } from './graphCardMetricTotals';
import { GraphCardChart } from './graphCardChart';
import { GraphCardContext, useGardCardSettings } from './graphCardContext';

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useGardCardSettings
 * @returns {Node}
 */
const GraphCard = ({ isDisabled, useGardCardSettings: useAliasGardCardSettings }) => {
  const { groupedContextSettings, standaloneContextSettings } = useAliasGardCardSettings();

  if (isDisabled) {
    return null;
  }

  return (
    <React.Fragment>
      {(groupedContextSettings && (
        <GraphCardContext.Provider value={groupedContextSettings}>
          <GraphCardChart />
        </GraphCardContext.Provider>
      )) ||
        null}
      {standaloneContextSettings?.map(contextSettings => (
        <GraphCardContext.Provider key={`graphCard_${contextSettings?.metric?.id}`} value={contextSettings}>
          <GraphCardMetricTotals>
            <GraphCardChart />
          </GraphCardMetricTotals>
        </GraphCardContext.Provider>
      ))}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{useGardCardSettings: Function, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  isDisabled: PropTypes.bool,
  useGardCardSettings: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGardCardSettings: Function, isDisabled: boolean}}
 */
GraphCard.defaultProps = {
  isDisabled: helpers.UI_DISABLED_GRAPH,
  useGardCardSettings
};

export { GraphCard as default, GraphCard };
