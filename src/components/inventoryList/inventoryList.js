import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { helpers } from '../../common';
import { connectTranslate, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
// import { TableSkeleton } from '../table/tableSkeleton';
import { Loader } from '../loader/loader';
import GuestsList from '../guestsList/guestsList';

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
    const { listData, listQuery, productId, t, viewId } = this.props;

    return (
      <Table
        className="curiosity-inventory-list"
        columnHeaders={[
          t('curiosity-inventory.headerName'),
          t('curiosity-inventory.headerInfrastructure'),
          t('curiosity-inventory.headerSocketsCores'),
          t('curiosity-inventory.headerLastSeen')
        ]}
        rows={listData.map(({ displayName, hardwareType, sockets, cores, lastSeen }) => ({
          cells: [displayName, hardwareType, `${sockets}/${cores}`, lastSeen],
          expandedContent: <GuestsList listQuery={listQuery} productId={productId} viewId={viewId} />
        }))}
      />
    );
  }

  render() {
    const { error, pending } = this.props;
    /*
    <TableSkeleton
            className="curiosity-inventory-list"
            columnHeaders={[
              t('curiosity-inventory.headerName'),
              t('curiosity-inventory.headerInfrastructure'),
              t('curiosity-inventory.headerSocketsCores'),
              t('curiosity-inventory.headerLastSeen')
            ]}
            cellCount={4}
            rowCount={2}
          />
     */
    return (
      <div className={`curiosity-inventory-list-wrapper fadein ${(error && 'blur') || ''}`}>
        {pending && (
          <Loader variant="table" tableProps={{ className: 'curiosity-inventory-list', colCount: 4, rowCount: 2 }} />
        )}
        {!pending && this.renderTable()}
      </div>
    );
  }
}

InventoryList.propTypes = {
  // columnHeaders: PropTypes.array,
  // rows: PropTypes.array,
  error: PropTypes.bool,
  // fulfilled: PropTypes.bool,
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
  // fulfilled: false,
  getHostsInventory: helpers.noop,
  listData: [],
  isDisabled: helpers.UI_DISABLED_TABLE,
  pending: false,
  t: helpers.noopTranslate,
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

const ConnectedInventoryList = connectTranslate(makeMapStateToProps, mapDispatchToProps)(InventoryList);

export { ConnectedInventoryList as default, ConnectedInventoryList, InventoryList };
