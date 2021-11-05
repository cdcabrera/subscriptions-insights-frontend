import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useProductGraphConfig } from '../productView/productViewContext';
import { GraphCardContext } from './graphCardContext';
import { helpers } from '../../common';
import { GraphCardMetrics } from './graphCardMetrics';
import { GraphCardMetric } from './graphCardMetric';
import { generateBaseSettings } from './graphCardHelpers';

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCard = ({ isDisabled, useProductGraphConfig: useAliasProductGraphConfig }) => {
  // const [context, setContext] = useState({});
  const { filters } = useAliasProductGraphConfig();
  const { groupedFilters, standaloneFilters } = generateBaseSettings(filters);

  /*
  useEffect(() => {
    const { groupedFilters, standaloneFilters } = generateBaseStyling(filters);

    setContext({
      settings: {
        groupedFilters,
        standaloneFilters,
        ...settings
      }
    });
  }, [filters, settings, setContext]);
  */

  if (isDisabled) {
    return null;
  }

  return (
    <React.Fragment>
      <GraphCardMetrics metricFilters={groupedFilters} />
      {standaloneFilters.map(metricFilter => (
        <GraphCardMetric key={`graphcard_${metricFilter.id}`} metricFilter={metricFilter} />
      ))}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphConfig: Function, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  isDisabled: PropTypes.bool,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphConfig: Function, isDisabled: boolean}}
 */
GraphCard.defaultProps = {
  isDisabled: helpers.UI_DISABLED_GRAPH,
  useProductGraphConfig
};

export { GraphCard as default, GraphCard };
