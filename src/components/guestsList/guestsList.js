import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { TableVariant } from '@patternfly/react-table';
import { helpers } from '../../common';
import { apiQueries, connect, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { inventoryListHelpers } from '../inventoryList/inventoryListHelpers';
import PaginationScroll from '../pagination/paginationScroll';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

// TODO: change limit back to 100, and in rhsmServices update to 700 for guests count
/**
 * A system inventory guests component.
 *
 * @augments React.Component
 * @fires onUpdateGuestsData
 * @fires onPage
 */
class GuestsList extends React.Component {
  state = { currentPage: 0, limit: 10 };

  componentDidMount() {
    this.onUpdateGuestsData();
  }

  /*
  componentDidUpdate(prevProps) {
    const { query, queryId } = this.props;

    if (queryId !== prevProps.queryId || !_isEqual(query, prevProps.query)) {
      this.onUpdateGuestsData();
    }
  }
   */

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateGuestsData
   */
  onUpdateGuestsData = () => {
    const { currentPage, limit } = this.state;
    const { getHostsInventoryGuests, query, queryId } = this.props;

    // if (!isDisabled && queryId && itemCount >= currentPage * 100) {
    if (queryId) {
      const updatedQuery = {
        ...query,
        [RHSM_API_QUERY_TYPES.LIMIT]: limit,
        [RHSM_API_QUERY_TYPES.OFFSET]: currentPage * limit || 0
      };

      const { guestsQuery } = apiQueries.parseRhsmQuery(updatedQuery);
      getHostsInventoryGuests(queryId, guestsQuery);
    }
  };

  /**
   * Update page state.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.page
   * @returns {Promise<boolean>}
   */
  onPage = async ({ page }) => {
    const { limit } = this.state;
    const { itemCount } = this.props;

    if (itemCount >= page * limit) {
      await this.setState(
        {
          currentPage: page - 1
        },
        () => {
          this.onUpdateGuestsData();
        }
      );

      return true;
    }

    return false;
  };

  /**
   * Render a guests table.
   *
   * @returns {Node}
   */
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

    const paginationScrollLoader = (
      <Loader
        variant="table"
        tableProps={{
          className: 'curiosity-inventory-guestlist__pagination-scroll',
          borders: false,
          colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
          rowCount: 0,
          variant: TableVariant.compact
        }}
      />
    );

    return (
      <PaginationScroll
        distanceFromBottom={100}
        elementHeight={275}
        onPage={this.onPage}
        loader={paginationScrollLoader}
      >
        <Table
          borders={false}
          variant={TableVariant.compact}
          className="curiosity-inventory-list"
          columnHeaders={updatedColumnHeaders}
          rows={updatedRows}
        />
      </PaginationScroll>
    );
  }

  /**
   * Render a guest list table.
   *
   * @returns {Node}
   */
  render() {
    const { error, filterGuestsData, listData, pending, perPageDefault } = this.props;

    return (
      <div className={`curiosity-inventory-list-wrapper fadein ${(error && 'blur') || ''}`}>
        {pending && (
          <Loader
            variant="table"
            tableProps={{
              borders: false,
              className: 'curiosity-inventory-guestlist',
              colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
              rowCount: perPageDefault,
              variant: TableVariant.compact
            }}
          />
        )}
        {!pending && this.renderTable()}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{viewId: string, productId: string, listData: Array, getHostsInventoryGuests: Function,
 *     filterGuestsData: object, pending: boolean, query: object, perPageDefault: number, error: boolean,
 *     itemCount: boolean, queryId: string}}
 */
GuestsList.propTypes = {
  error: PropTypes.bool,
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
  itemCount: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  perPageDefault: PropTypes.number,
  query: PropTypes.object.isRequired,
  queryId: PropTypes.string.isRequired,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, listData: Array, getHostsInventoryGuests: Function, filterGuestsData: Array,
 *     pending: boolean, perPageDefault: number, error: boolean, itemCount: number}}
 */
GuestsList.defaultProps = {
  error: false,
  filterGuestsData: [],
  getHostsInventoryGuests: helpers.noop,
  itemCount: 0,
  listData: [],
  pending: false,
  perPageDefault: 5,
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
