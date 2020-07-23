import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { helpers } from '../../common';
import { connectTranslate, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';

class GuestsList extends React.Component {
  componentDidMount() {
    console.log('ON MOUNT');
    this.onUpdateData();
  }

  componentDidUpdate(prevProps) {
    const { listQuery, productId } = this.props;

    console.log('ON UPDATE');

    if (productId !== prevProps.productId || !_isEqual(listQuery, prevProps.listQuery)) {
      // this.onUpdateData();
    }
  }

  onUpdateData = () => {
    const { getHostsInventoryGuests, listQuery, isDisabled, productId } = this.props;

    // FIXME: PRODUCTID SHOULD BE THE SUBSCRIPTION MANAGER ID
    if (!isDisabled && productId) {
      getHostsInventoryGuests(productId, listQuery);
    }
  };

  /**
   * FixMe: PF tables don't appear to respond to "border={false}" when nested as expandable.
   * We've patched this behavior with CSS styling.
   */
  /**
   * Render a guest list table.
   *
   * @returns {Node}
   */
  render() {
    const { listData, t } = this.props;

    return (
      <Table
        borders={false}
        className="curiosity-inventory-guestlist"
        columnHeaders={[
          t('curiosity-inventory.headerName'),
          t('curiosity-inventory.headerUUID'),
          t('curiosity-inventory.headerLastSeen')
        ]}
        rows={listData.map(({ displayName, insightsId, lastSeen }) => ({
          cells: [displayName, insightsId, lastSeen]
        }))}
      >
        Loading...
      </Table>
    );
  }
}

GuestsList.propTypes = {
  // error: PropTypes.bool,
  // fulfilled: PropTypes.bool,
  getHostsInventoryGuests: PropTypes.func,
  isDisabled: PropTypes.bool,
  listData: PropTypes.array,
  // pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  listQuery: PropTypes.object.isRequired,
  t: PropTypes.func
  // viewId: PropTypes.string
};

GuestsList.defaultProps = {
  // error: false,
  // fulfilled: false,
  getHostsInventoryGuests: helpers.noop,
  listData: [],
  isDisabled: helpers.UI_DISABLED_TABLE,
  // pending: false,
  t: helpers.noopTranslate
  // viewId: 'inventoryList'
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getHostsInventoryGuests: (id, query) => dispatch(reduxActions.rhsm.getHostsInventoryGuests(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.guestsList.makeGuestsList();

const ConnectedGuestsList = connectTranslate(makeMapStateToProps, mapDispatchToProps)(GuestsList);

export { ConnectedGuestsList as default, ConnectedGuestsList, GuestsList };
