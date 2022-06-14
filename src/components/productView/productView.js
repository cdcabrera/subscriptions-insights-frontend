import React from 'react';
import PropTypes from 'prop-types';
import { useRouteDetail } from '../../hooks/useRouter';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages, PageColumns } from '../pageLayout/pageLayout';
import { apiQueries } from '../../redux';
import { GraphCard } from '../graphCard/graphCard';
import { Toolbar } from '../toolbar/toolbar';
import { ConnectedInventoryList as ConnectedInventoryListDeprecated } from '../inventoryCard/inventoryList.deprecated';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions/inventoryCardSubscriptions';
import { RHSM_API_PATH_PRODUCT_TYPES } from '../../services/rhsm/rhsmConstants';
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
 * Display product columns.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useRouteDetail
 * @returns {Node}
 */
const ProductView = ({ t, useRouteDetail: useAliasRouteDetail }) => {
  const { productParameter: routeProductLabel, productConfig } = useAliasRouteDetail();

  const renderProduct = config => {
    const {
      graphTallyQuery,
      inventoryHostsQuery,
      inventorySubscriptionsQuery,
      query,
      initialGuestsFilters,
      initialInventoryFilters,
      initialInventorySettings,
      initialSubscriptionsInventoryFilters,
      productId,
      viewId
    } = config;

    if (!productId || !viewId) {
      return null;
    }

    const { inventoryHostsQuery: initialInventoryHostsQuery } = apiQueries.parseRhsmQuery(query, {
      graphTallyQuery,
      inventoryHostsQuery,
      inventorySubscriptionsQuery
    });

    return (
      <ProductViewContext.Provider value={config} key={`product_${productId}`}>
        <PageMessages>{productId !== RHSM_API_PATH_PRODUCT_TYPES.RHOSAK && <BannerMessages />}</PageMessages>
        <PageToolbar>
          <Toolbar />
        </PageToolbar>
        <PageSection>
          <GraphCard />
        </PageSection>
        <PageSection
          className={(productId === RHSM_API_PATH_PRODUCT_TYPES.RHOSAK && 'curiosity-page-section__tabs') || ''}
        >
          <InventoryTabs
            key={`inventory_${productId}`}
            productId={productId}
            isDisabled={
              (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
            }
          >
            {!helpers.UI_DISABLED_TABLE_HOSTS &&
              productId !== RHSM_API_PATH_PRODUCT_TYPES.RHOSAK &&
              initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_hosts_${productId}`}
                  title={t('curiosity-inventory.tabHosts', { context: ['noInstances', productId] })}
                >
                  <ConnectedInventoryListDeprecated
                    key={`inv_${productId}`}
                    filterGuestsData={initialGuestsFilters}
                    filterInventoryData={initialInventoryFilters}
                    productId={productId}
                    settings={initialInventorySettings}
                    query={initialInventoryHostsQuery}
                    viewId={viewId}
                  />
                </InventoryTab>
              )}
            {!helpers.UI_DISABLED_TABLE_INSTANCES &&
              productId === RHSM_API_PATH_PRODUCT_TYPES.RHOSAK &&
              initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_instances_${productId}`}
                  title={t('curiosity-inventory.tabInstances', { context: ['noInstances', productId] })}
                >
                  <InventoryCard />
                </InventoryTab>
              )}
            {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && initialSubscriptionsInventoryFilters && (
              <InventoryTab
                key={`inventory_subs_${productId}`}
                title={t('curiosity-inventory.tabSubscriptions', { context: productId })}
              >
                <InventoryCardSubscriptions />
              </InventoryTab>
            )}
          </InventoryTabs>
        </PageSection>
      </ProductViewContext.Provider>
    );
  };

  return (
    <PageLayout>
      <PageHeader productLabel={routeProductLabel}>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: routeProductLabel })}
      </PageHeader>
      <PageColumns>{productConfig.map(config => renderProduct(config))}</PageColumns>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{t: translate, useRouteDetail: Function}}
 */
ProductView.propTypes = {
  t: PropTypes.func,
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, useRouteDetail: Function}}
 */
ProductView.defaultProps = {
  t: translate,
  useRouteDetail
};

export { ProductView as default, ProductView };
