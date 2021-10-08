import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { ProductContext } from './productContext';
import { PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { apiQueries, storeHooks } from '../../redux';
import { ConnectedGraphCard, GraphCard } from '../graphCard/graphCard';
import { ConnectedToolbar, Toolbar } from '../toolbar/toolbar';
import { ConnectedInventoryList, InventoryList } from '../inventoryList/inventoryList';
import { ToolbarFieldGranularity } from '../toolbar/toolbarFieldGranularity';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import {
  ConnectedInventorySubscriptions,
  InventorySubscriptions
} from '../inventorySubscriptions/inventorySubscriptions';
import { GuestsList } from '../guestsList/guestsList';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * ToDo: base for default product layouts, add additional props for various toolbars
 * Next steps include...
 * Consider being able to pass customized toolbars for GraphCard and the
 * various Inventory displays. Have to evaluate how to handle the global toolbar, one
 * consideration is creating optional widgets with self-contained state update ability
 * based off of context/props/etc.
 * OR
 * Make everything come from the configs, including toolbars!
 *
 * Moving existing products to this layout, or maintaining them "as is", then renaming and
 * relocating them to this directory if they've been customized beyond a basic layout.
 */
/**
 * Display a product column with context.
 *
 * @param {object} props
 * @param {object} props.config
 * @param {Function} props.t
 * @param {Node|boolean} props.toolbarGraph
 * @param {boolean} props.toolbarGraphDescription
 * @param {Node|boolean} props.toolbarProduct
 * @returns {Node}
 */
const ProductViewColumn = ({ config, t, toolbarGraph, toolbarGraphDescription, toolbarProduct }) => {
  const [context, setContext] = useState();

  console.log('>>>>>>>>>>>>>>>>>>>> CONTEXT', context);

  const {
    graphTallyQuery,
    inventoryHostsQuery,
    inventorySubscriptionsQuery,
    query,
    initialToolbarFilters,
    initialGraphFilters,
    initialGraphSettings,
    initialGuestsFilters,
    initialInventoryFilters,
    initialInventorySettings,
    initialSubscriptionsInventoryFilters,
    productContextFilterUom,
    productLabel,
    productId,
    viewId
  } = config;

  const uomValue = storeHooks.reactRedux.useSelector(
    ({ view }) => view.query?.[viewId]?.[RHSM_API_QUERY_TYPES.UOM],
    null
  );

  const updatedQueryUomValue = uomValue || query?.[RHSM_API_QUERY_TYPES.UOM];

  useEffect(() => {
    const updatedConfig = { ...config };

    console.log('>>>>>>>>>>> EFFECT', updatedConfig);

    /*
    let uomFilter;

    if (productContextFilterUom === true) {
      uomFilter = updatedQueryUomValue;

      const filter = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(uomFilter, 'i').test(id);
      };

      updatedConfig.initialGraphFilters = initialGraphFilters.filter(filter);
      updatedConfig.initialInventoryFilters = initialInventoryFilters.filter(filter);
      updatedConfig.initialSubscriptionsInventoryFilters = initialSubscriptionsInventoryFilters.filter(filter);
    }
    */

    setContext(updatedConfig);
  }, [
    config,
    productContextFilterUom,
    updatedQueryUomValue,
    initialGraphFilters,
    initialInventoryFilters,
    initialSubscriptionsInventoryFilters
  ]);

  /**
   * ToDo: remove this block once query hooks are in place on child components.
   * Currently used to prop-drill and charge the initial api queries.
   */
  const {
    graphTallyQuery: initialGraphTallyQuery,
    inventoryHostsQuery: initialInventoryHostsQuery,
    inventorySubscriptionsQuery: initialInventorySubscriptionsQuery,
    toolbarQuery: initialToolbarQuery
  } = apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

  if (!productId || !viewId) {
    return null;
  }

  let graphCardTooltip = null;

  if (toolbarGraphDescription) {
    graphCardTooltip = (
      <Tooltip
        content={<p>{t('curiosity-graph.cardHeadingDescription', { context: productId })}</p>}
        position={TooltipPosition.top}
        enableFlip={false}
        distance={5}
        entryDelay={100}
        exitDelay={0}
      >
        <sup className="curiosity-icon__info">
          <InfoCircleIcon />
        </sup>
      </Tooltip>
    );
  }

  const graphCardTitle = (
    <React.Fragment>
      {t('curiosity-graph.cardHeading', { context: productId })}
      {graphCardTooltip}
    </React.Fragment>
  );

  return (
    <ProductContext.Provider value={context}>
      <PageToolbar>
        {(React.isValidElement(toolbarProduct) && toolbarProduct) ||
          (toolbarProduct !== false && (
            <ConnectedToolbar
              filterOptions={initialToolbarFilters}
              productId={productId}
              query={initialToolbarQuery}
              viewId={viewId}
            />
          ))}
      </PageToolbar>
      <PageSection>
        <ConnectedGraphCard
          key={`graph_${productId}`}
          filterGraphData={initialGraphFilters}
          settings={initialGraphSettings}
          query={initialGraphTallyQuery}
          productId={productId}
          viewId={viewId}
          cardTitle={graphCardTitle}
          productLabel={productLabel}
        >
          {(React.isValidElement(toolbarGraph) && toolbarGraph) ||
            (toolbarGraph !== false && (
              <ToolbarFieldGranularity
                viewId={viewId}
                value={initialGraphTallyQuery[RHSM_API_QUERY_TYPES.GRANULARITY]}
              />
            ))}
        </ConnectedGraphCard>
      </PageSection>
      <PageSection>
        <InventoryTabs key={`inventory_${productId}`} productId={productId}>
          <InventoryTab
            key={`inventory_hosts_${productId}`}
            title={t('curiosity-inventory.tabHosts', { context: ['noInstances', productId] })}
          >
            <ConnectedInventoryList
              key={`inv_${productId}`}
              filterGuestsData={initialGuestsFilters}
              filterInventoryData={initialInventoryFilters}
              productId={productId}
              settings={initialInventorySettings}
              query={initialInventoryHostsQuery}
              viewId={viewId}
            />
          </InventoryTab>
          {initialSubscriptionsInventoryFilters && (
            <InventoryTab
              key={`inventory_subs_${productId}`}
              title={t('curiosity-inventory.tabSubscriptions', { context: productId })}
            >
              <ConnectedInventorySubscriptions
                key={`subs_${productId}`}
                filterInventoryData={initialSubscriptionsInventoryFilters}
                productId={productId}
                query={initialInventorySubscriptionsQuery}
                viewId={viewId}
              />
            </InventoryTab>
          )}
        </InventoryTabs>
      </PageSection>
    </ProductContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{t: translate, toolbarGraph: (Node|boolean), toolbarGraphDescription: boolean, toolbarProduct: (Node|boolean)}}
 */
ProductViewColumn.propTypes = {
  config: PropTypes.shape({
    graphTallyQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
    }).isRequired,
    inventoryHostsQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SORT_TYPES)]),
      [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
    }).isRequired,
    inventorySubscriptionsQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES)]),
      [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
    }),
    query: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.START_DATE]: PropTypes.string,
      [RHSM_API_QUERY_TYPES.END_DATE]: PropTypes.string
    }).isRequired,
    initialToolbarFilters: Toolbar.propTypes.filterOptions,
    initialGraphFilters: GraphCard.propTypes.filterGraphData,
    initialGraphSettings: GraphCard.propTypes.settings,
    initialGuestsFilters: GuestsList.propTypes.filterGuestsData,
    initialInventoryFilters: InventoryList.propTypes.filterInventoryData,
    initialInventorySettings: InventoryList.propTypes.settings,
    initialSubscriptionsInventoryFilters: InventorySubscriptions.propTypes.filterInventoryData,
    productContextFilterUom: PropTypes.bool,
    productLabel: PropTypes.string.isRequired,
    productId: PropTypes.string.isRequired,
    viewId: PropTypes.string.isRequired
  }).isRequired,
  t: PropTypes.func,
  toolbarGraph: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  toolbarGraphDescription: PropTypes.bool,
  toolbarProduct: PropTypes.oneOfType([PropTypes.node, PropTypes.bool])
};

/**
 * Default props.
 *
 * @type {{t: translate, toolbarGraph: (Node|boolean), toolbarGraphDescription: boolean, toolbarProduct: (Node|boolean)}}
 */
ProductViewColumn.defaultProps = {
  t: translate,
  toolbarGraph: null,
  toolbarGraphDescription: false,
  toolbarProduct: null
};

export { ProductViewColumn as default, ProductViewColumn };
