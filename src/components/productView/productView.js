import React from 'react';
import PropTypes from 'prop-types';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages } from '../pageLayout/pageLayout';
import { apiQueries, connect, reduxSelectors } from '../../redux';
import { ConnectedGraphCard, GraphCard } from '../graphCard/graphCard';
import { ConnectedToolbar, Toolbar } from '../toolbar/toolbar';
import { ConnectedInventoryList, InventoryList } from '../inventoryList/inventoryList';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import { ToolbarFieldGranularity } from '../toolbar/toolbarFieldGranularity';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import {
  ConnectedInventorySubscriptions,
  InventorySubscriptions
} from '../inventorySubscriptions/inventorySubscriptions';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';
import { GuestsList } from '../guestsList/guestsList';
import { translate } from '../i18n/i18n';

/**
 * ToDo: base for default product layouts, add additional props for various toolbars
 * Next steps include...
 * Consider being able to pass customized toolbars for GraphCard and the
 * various Inventory displays. Have to evaluate how to handle the global toolbar, one
 * consideration is creating optional widgets with self-contained state update ability
 * based off of context/props/etc.
 *
 * Moving existing products to this layout, or maintaining them "as is", then renaming and
 * relocating them to this directory if they've been customized beyond a basic layout.
 */
/**
 * Display a product.
 *
 * @param {object} props
 * @param {object} props.productConfig
 * @param {object} props.routeDetail
 * @param {Function} props.t
 * @param {Node} props.toolbarGraph
 * @param {Node} props.toolbarProduct
 * @returns {Node}
 */
const ProductView = ({ productConfig, routeDetail, t, toolbarGraph, toolbarProduct }) => {
  const {
    graphTallyQuery,
    inventoryHostsQuery,
    inventorySubscriptionsQuery,
    query,
    initialToolbarFilters,
    initialGraphFilters,
    initialGuestsFilters,
    initialInventoryFilters,
    initialInventorySettings,
    initialSubscriptionsInventoryFilters
  } = productConfig;

  const {
    query: initialQuery,
    graphTallyQuery: initialGraphTallyQuery,
    inventoryHostsQuery: initialInventoryHostsQuery,
    inventorySubscriptionsQuery: initialInventorySubscriptionsQuery,
    toolbarQuery: initialToolbarQuery
  } = apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

  const { pathParameter: productId, productParameter: productLabel, viewParameter: viewId } = routeDetail;

  if (!productId || !viewId) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader productLabel={productLabel} includeTour>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productLabel })}
      </PageHeader>
      <PageMessages>
        <BannerMessages productId={productId} viewId={viewId} query={initialQuery} />
      </PageMessages>
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
          query={initialGraphTallyQuery}
          productId={productId}
          viewId={viewId}
          cardTitle={t('curiosity-graph.cardHeading', { context: productId })}
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
          <InventoryTab key={`inventory_hosts_${productId}`} title={t('curiosity-inventory.tab', { context: 'hosts' })}>
            <ConnectedInventoryList
              key={productId}
              filterGuestsData={initialGuestsFilters}
              filterInventoryData={initialInventoryFilters}
              productId={productId}
              settings={initialInventorySettings}
              query={initialInventoryHostsQuery}
              viewId={viewId}
            />
          </InventoryTab>
          {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && (
            <InventoryTab
              key={`inventory_subs_${productId}`}
              title={t('curiosity-inventory.tab', { context: 'subscriptions' })}
            >
              <ConnectedInventorySubscriptions
                key={productId}
                filterInventoryData={initialSubscriptionsInventoryFilters}
                productId={productId}
                query={initialInventorySubscriptionsQuery}
                viewId={viewId}
              />
            </InventoryTab>
          )}
        </InventoryTabs>
      </PageSection>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{t: Function, routeDetail: object, productConfig: object}}
 */
ProductView.propTypes = {
  productConfig: PropTypes.shape({
    graphTallyQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]),
      [RHSM_API_QUERY_TYPES.START_DATE]: PropTypes.string,
      [RHSM_API_QUERY_TYPES.END_DATE]: PropTypes.string
    }),
    inventoryHostsQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SORT_TYPES)]),
      [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
    }),
    inventorySubscriptionsQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES)]),
      [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
    }),
    query: PropTypes.object,
    initialToolbarFilters: Toolbar.propTypes.filterOptions,
    initialGraphFilters: GraphCard.propTypes.filterGraphData,
    initialGuestsFilters: GuestsList.propTypes.filterGuestsData,
    initialInventoryFilters: InventoryList.propTypes.filterInventoryData,
    initialInventorySettings: InventoryList.propTypes.settings,
    initialSubscriptionsInventoryFilters: InventorySubscriptions.propTypes.filterInventoryData
  }).isRequired,
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string,
    productParameter: PropTypes.string,
    viewParameter: PropTypes.string
  }).isRequired,
  t: PropTypes.func,
  toolbarGraph: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  toolbarProduct: PropTypes.oneOfType([PropTypes.node, PropTypes.bool])
};

/**
 * Default props.
 *
 * @type {{t: translate}}
 */
ProductView.defaultProps = {
  t: translate,
  toolbarGraph: null,
  toolbarProduct: null
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.view.makeView(ProductView.defaultProps);

const ConnectedProductView = connect(makeMapStateToProps)(ProductView);

export { ConnectedProductView as default, ConnectedProductView, ProductView };
