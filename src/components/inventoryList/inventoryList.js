import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { TableVariant } from '@patternfly/react-table';
import { helpers } from '../../common';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import GuestsList from '../guestsList/guestsList';
import { translate } from '../i18n/i18n';

class InventoryList extends React.Component {
  componentDidMount() {
    this.onUpdateInventoryData();
  }

  componentDidUpdate(prevProps) {
    const { listQuery, productId } = this.props;

    if (productId !== prevProps.productId || !_isEqual(listQuery, prevProps.listQuery)) {
      this.onUpdateInventoryData();
    }
  }

  onUpdateInventoryData = () => {
    const { getHostsInventory, listQuery, isDisabled, productId } = this.props;

    if (!isDisabled && productId) {
      getHostsInventory(productId, listQuery);
    }
  };

  renderTable() {
    const { listData, listQuery, t } = this.props;

    const rows = listData.map(
      ({ cores, displayName, hardwareType, lastSeen, numberOfGuests, sockets, subscriptionManagerId }) => ({
        cells: [displayName, hardwareType, `${sockets}/${cores}`, lastSeen],
        expandedContent: (
          <GuestsList listQuery={listQuery} listQueryId={subscriptionManagerId} loaderRowCount={numberOfGuests} />
        )
      })
    );

    return (
      <Table
        borders
        variant={TableVariant.compact}
        className="curiosity-inventory-list"
        columnHeaders={[
          t('curiosity-inventory.headerName'),
          t('curiosity-inventory.headerInfrastructure'),
          t('curiosity-inventory.headerSocketsCores'),
          t('curiosity-inventory.headerLastSeen')
        ]}
        rows={rows}
      />
    );
  }

  render() {
    const { error, pending } = this.props;

    return (
      <div className={`curiosity-inventory-list-wrapper fadein ${(error && 'blur') || ''}`}>
        {pending && (
          <Loader
            variant="table"
            tableProps={{
              className: 'curiosity-inventory-list',
              colCount: 4,
              rowCount: 5,
              variant: TableVariant.compact
            }}
          />
        )}
        {!pending && this.renderTable()}
      </div>
    );
  }
}

InventoryList.propTypes = {
  error: PropTypes.bool,
  getHostsInventory: PropTypes.func,
  isDisabled: PropTypes.bool,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  listQuery: PropTypes.object.isRequired,
  t: PropTypes.func,
  viewId: PropTypes.string
};

InventoryList.defaultProps = {
  error: false,
  getHostsInventory: helpers.noop,
  listData: [],
  isDisabled: helpers.UI_DISABLED_TABLE,
  pending: false,
  t: translate,
  viewId: 'inventoryList'
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getHostsInventory: (id, query) => dispatch(reduxActions.rhsm.getHostsInventory(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.inventoryList.makeInventoryList();

const ConnectedInventoryList = connect(makeMapStateToProps, mapDispatchToProps)(InventoryList);

export { ConnectedInventoryList as default, ConnectedInventoryList, InventoryList };
