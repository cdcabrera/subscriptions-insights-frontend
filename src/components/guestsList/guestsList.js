import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { TableVariant } from '@patternfly/react-table';
import { helpers } from '../../common';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { inventoryListHelpers } from '../inventoryList/inventoryListHelpers';
import InfiniteScroll from '../pagination/infiniteScroll';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

class GuestsList extends React.Component {
  componentDidMount() {
    this.onUpdateGuestsData();
  }

  componentDidUpdate(prevProps) {
    const { query, queryId } = this.props;

    if (queryId !== prevProps.queryId || !_isEqual(query, prevProps.query)) {
      this.onUpdateGuestsData();
    }
  }

  onUpdateGuestsData = () => {
    const { getHostsInventoryGuests, query, queryId, isDisabled } = this.props;

    if (!isDisabled && queryId) {
      getHostsInventoryGuests(queryId, query);
    }
  };

  renderTable() {
    const { filterGuestsData, listData } = this.props;
    let updatedColumnHeaders = [];

    const updatedRows = listData.map(({ ...cellData }) => {
      const { columnHeaders, cells } = inventoryListHelpers.parseRowCellsListData({
        filters: filterGuestsData,
        cellData
      });

      updatedColumnHeaders = columnHeaders;

      return {
        cells
      };
    });

    return (
      <Table
        borders={false}
        variant={TableVariant.compact}
        className="curiosity-inventory-list"
        columnHeaders={updatedColumnHeaders}
        rows={updatedRows}
      />
    );
  }

  /**
   * Render a guest list table.
   *
   * @returns {Node}
   */
  render() {
    const {
      error,
      filterGuestsData,
      isDisabled,
      itemCount,
      listData,
      pending,
      perPageDefault,
      productId,
      query,
      viewId
    } = this.props;

    if (isDisabled) {
      return null;
    }

    const updatedPerPage = query?.[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;
    const loaderPerPage = updatedPerPage / 2;

    return (
      <div className={`curiosity-inventory-list-wrapper fadein ${(error && 'blur') || ''}`}>
        {pending && (
          <Loader
            variant="table"
            tableProps={{
              borders: false,
              className: 'curiosity-inventory-guestlist',
              colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
              rowCount: listData?.length || loaderPerPage,
              variant: TableVariant.compact
            }}
          />
        )}
        {!pending && (
          <InfiniteScroll
            isDisabled={pending || error}
            itemCount={itemCount}
            productId={productId}
            viewId={viewId}
            itemsPerPageDefault={updatedPerPage}
          >
            {this.renderTable()}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}

GuestsList.propTypes = {
  error: PropTypes.bool,
  /*
  filterGuestsDataOLD: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.string
      }),
      PropTypes.shape({
        header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      })
    ]).isRequired
  ),
  */
  filterGuestsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      header: PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.string
        }),
        PropTypes.func
      ]),
      cell: PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.string
        }),
        PropTypes.func
      ])
    }).isRequired
  ),
  getHostsInventoryGuests: PropTypes.func,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  perPageDefault: PropTypes.number,
  query: PropTypes.object.isRequired,
  queryId: PropTypes.string.isRequired,
  viewId: PropTypes.string
};

GuestsList.defaultProps = {
  error: false,
  filterGuestsData: [],
  getHostsInventoryGuests: helpers.noop,
  isDisabled: helpers.UI_DISABLED_TABLE,
  itemCount: 0,
  listData: [],
  pending: false,
  perPageDefault: 10,
  viewId: 'guestsList'
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

const ConnectedGuestsList = connect(makeMapStateToProps, mapDispatchToProps)(GuestsList);

export { ConnectedGuestsList as default, ConnectedGuestsList, GuestsList };
