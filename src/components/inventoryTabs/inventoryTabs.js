import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { Tabs } from '../tabs/tabs';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { InventoryTab } from './inventoryTab';

/**
 * A system inventory tabs component.
 * Render inventory tabs using Inventory tab passed props only. A parallel outcome can be
 * achieved by passing an array of objects through a prop.
 *
 * @fires onTab
 * @param {object} props
 * @param {number} props.activeTab
 * @param {React.ReactNode} props.children
 * @param {number} props.defaultActiveTab
 * @param {boolean} props.isDisabled
 * @param {string} props.productId
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelector
 * @returns {React.ReactNode|null}
 */
const InventoryTabs = ({
  activeTab,
  children,
  defaultActiveTab,
  isDisabled,
  productId,
  t,
  useDispatch: useAliasDispatch,
  useSelector: useAliasSelector
}) => {
  const updatedActiveTab = useAliasSelector(({ inventory }) => inventory.tabs?.[productId], activeTab);
  const dispatch = useAliasDispatch();

  /**
   * On tab update state.
   *
   * @event onTab
   * @param {object} params
   * @param {string} params.index tab index
   */
  const onTab = ({ index }) => {
    dispatch({
      type: reduxTypes.inventory.SET_INVENTORY_TAB,
      tabs: {
        [productId]: index
      }
    });
  };

  if (isDisabled) {
    return null;
  }

  const updatedChildren = React.Children.toArray(children).map((child, index) => {
    const { props: childProps = {} } = child;

    return {
      active: childProps.active || false,
      content: childProps.children || child,
      title: childProps.title || t('curiosity-inventory.tabSubHeading', { count: index })
    };
  });

  return (
    <React.Fragment>
      <Title headingLevel="h2" className="sr-only">
        {t('curiosity-inventory.tabHeading', { count: updatedChildren.length })}
      </Title>
      <Tabs activeTab={updatedActiveTab} defaultActiveTab={defaultActiveTab} onTab={onTab} tabs={updatedChildren} />
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{productId: string, t: Function, children: Node, defaultActiveTab: number, isDisabled: boolean,
 *     activeTab: number}}
 */
InventoryTabs.propTypes = {
  activeTab: PropTypes.number,
  children: PropTypes.node.isRequired,
  defaultActiveTab: PropTypes.number,
  isDisabled: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, defaultActiveTab: number, isDisabled: boolean, activeTab: number}}
 */
InventoryTabs.defaultProps = {
  activeTab: 0,
  defaultActiveTab: 0,
  isDisabled: helpers.UI_DISABLED_TABLE,
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useSelector: storeHooks.reactRedux.useSelector
};

export { InventoryTabs as default, InventoryTabs, InventoryTab };
