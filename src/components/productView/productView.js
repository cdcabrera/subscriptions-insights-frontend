import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { useRouteDetail } from '../../hooks/useRouter';
import { useRouteDetail, useSearchParams, useLocation } from '../router/routerContext';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages, PageColumns } from '../pageLayout/pageLayout';
import { GraphCard } from '../graphCard/graphCard';
import { Toolbar } from '../toolbar/toolbar';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { InventoryCardHosts } from '../inventoryCard/inventoryCardHosts';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions/inventoryCardSubscriptions';
import { RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import { Select } from '../form/select';
// import { routerHelpers } from '../router/routerHelpers';

/**
 * Display product columns.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useRouteDetail
 * @returns {Node}
 */
const ProductView = ({ t, useRouteDetail: useAliasRouteDetail }) => {
  const { configsByGroup, productGroup, productConfig } = useAliasRouteDetail() || {};
  const [updatedContext, setUpdatedContext] = useState(productConfig);
  console.log('>>> configsByGroup', configsByGroup);
  // const again = useAliasRouteDetail();
  // console.log('>>>> testing config', again);
  // const { routeProductLabel, productConfig } = {};
  const [testo, setTesto] = useSearchParams();
  const test2 = useLocation();

  console.log('>>>> testing hooks 001', testo);
  console.log('>>>> testing hooks 002', test2);
  // const { id } = useAliasRouteDetail();
  // const { productParameter: routeProductLabel, productConfig } = id && routerHelpers.getRouteConfig({ id });

  const renderProduct = config => {
    const { initialInventoryFilters, initialSubscriptionsInventoryFilters, productDisplay, productId, viewId } = config;

    if (!productId || !viewId) {
      return null;
    }

    return (
      <ProductViewContext.Provider value={config} key={`product_${productId}`}>
        <PageMessages>{productDisplay !== DISPLAY_TYPES.HOURLY && <BannerMessages />}</PageMessages>
        <PageToolbar>
          <Toolbar />
        </PageToolbar>
        <PageSection>
          <GraphCard />
        </PageSection>
        <PageSection className={(productDisplay === DISPLAY_TYPES.HOURLY && 'curiosity-page-section__tabs') || ''}>
          <InventoryTabs
            key={`inventory_${productId}`}
            productId={productId}
            isDisabled={
              (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
            }
          >
            {!helpers.UI_DISABLED_TABLE_HOSTS && productDisplay !== DISPLAY_TYPES.HOURLY && initialInventoryFilters && (
              <InventoryTab
                key={`inventory_hosts_${productId}`}
                title={t('curiosity-inventory.tabHosts', { context: [productId] })}
              >
                <InventoryCardHosts />
              </InventoryTab>
            )}
            {!helpers.UI_DISABLED_TABLE_INSTANCES &&
              productDisplay === DISPLAY_TYPES.HOURLY &&
              initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_instances_${productId}`}
                  title={t('curiosity-inventory.tabInstances', { context: [productId] })}
                >
                  <InventoryCard />
                </InventoryTab>
              )}
            {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && initialSubscriptionsInventoryFilters && (
              <InventoryTab
                key={`inventory_subs_${productId}`}
                title={t('curiosity-inventory.tabSubscriptions', { context: [productId] })}
              >
                <InventoryCardSubscriptions />
              </InventoryTab>
            )}
          </InventoryTabs>
        </PageSection>
      </ProductViewContext.Provider>
    );
  };

  const doit = ({ value }) => {
    console.log('>>> DO IT', value);
    setUpdatedContext([value]);
  };

  return (
    (productGroup && (
      <PageLayout>
        <PageHeader productLabel={productGroup}>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productGroup })}
          <br />
          <Select
            placeholder="testing"
            onSelect={doit}
            options={configsByGroup.map(obj => ({ title: obj.productId, value: obj }))}
          />
        </PageHeader>
        <PageColumns>{updatedContext?.map(config => renderProduct(config))}</PageColumns>
        <a
          href="#"
          onClick={event => {
            event.preventDefault();
            setTesto({ fred: 'do it' });
          }}
        >
          do it
        </a>
      </PageLayout>
    )) ||
    null
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
