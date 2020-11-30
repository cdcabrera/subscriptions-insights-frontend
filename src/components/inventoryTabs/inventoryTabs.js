import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { connect, reduxTypes, store } from '../../redux';
import { Tabs } from '../tabs/tabs';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * ToDo: Revisit using tabs attribute vs children
 * Our initial tab implementation used children. This come across as backtracking, however upon
 * review with a ProductView POC using an array/list based on a product config was easier to
 * handle programmatically. Related to not every product having access to all tabs, or certain
 * products having a different default tab.
 */
/**
 * A system inventory tabs component.
 *
 * @augments React.Component
 * @fires onTab
 */
class InventoryTabs extends React.Component {
  /**
   * On tab update state.
   *
   * @event onTab
   * @param {object} params
   * @param {string} params.index tab index
   */
  onTab = ({ index }) => {
    const { productId } = this.props;

    store.dispatch({
      type: reduxTypes.inventory.SET_INVENTORY_TAB,
      tabs: {
        [productId]: index
      }
    });
  };

  /**
   * Render inventory tabs.
   *
   * @returns {Node}
   */
  render() {
    const { activeTab, isDisabled, tabs, t } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <React.Fragment>
        <Title headingLevel="h2" className="sr-only">
          {t('curiosity-inventory.tabHeading')}
        </Title>
        <Tabs activeTab={activeTab} onTab={this.onTab} tabs={tabs} />
      </React.Fragment>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{productId: string, tabs: Array, isDisabled: boolean, activeTab: number}}
 */
InventoryTabs.propTypes = {
  activeTab: PropTypes.number,
  isDisabled: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  tabs: Tabs.propTypes.tabs.isRequired,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{isDisabled: boolean, activeTab: number}}
 */
InventoryTabs.defaultProps = {
  activeTab: 0,
  isDisabled: helpers.UI_DISABLED_TABLE,
  t: translate
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const mapStateToProps = ({ inventory }, { productId }) => ({ activeTab: inventory.tabs?.[productId] });

const ConnectedInventoryTabs = connect(mapStateToProps)(InventoryTabs);

export { ConnectedInventoryTabs as default, ConnectedInventoryTabs, InventoryTabs };
