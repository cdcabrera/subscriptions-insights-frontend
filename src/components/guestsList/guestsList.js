import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import _isEqual from 'lodash/isEqual';
import { helpers } from '../../common';
import { apiQueries, connect, reduxActions, reduxSelectors } from '../../redux';
import { Loader } from '../loader/loader';
import { inventoryListHelpers } from '../inventoryList/inventoryListHelpers';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Table } from '../table/table';
import { TableScroll } from '../table/tableScroll';
import { PaginationScroll } from '../pagination/paginationScroll';

// TODO: change limit back to 100, and in rhsmServices update to 700 for guests count
/**
 * A system inventory guests component.
 *
 * @param event
 * @augments React.Component
 * @fires onUpdateGuestsData
 * @fires onPage
 */
class GuestsList extends React.Component {
  previousData = [];

  state = { currentPage: 0, limit: 10, previousData: [] };

  componentDidMount() {
    this.onUpdateGuestsData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;

    if (currentPage !== prevState.currentPage) {
      this.onUpdateGuestsData();
    }
  }

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateGuestsData
   */
  onUpdateGuestsData = async () => {
    const { currentPage, limit } = this.state;
    const { getHostsInventoryGuests, query, id } = this.props;

    if (id) {
      const updatedQuery = {
        ...query,
        [RHSM_API_QUERY_TYPES.LIMIT]: limit,
        [RHSM_API_QUERY_TYPES.OFFSET]: currentPage * limit || 0
      };

      const { guestsQuery } = apiQueries.parseRhsmQuery(updatedQuery);
      await getHostsInventoryGuests(id, guestsQuery);
    }
  };

  onScroll = event => {
    const { target } = event;
    const { currentPage, limit, previousData } = this.state;
    const { numberOfEntries, pending, listData } = this.props;

    // const distanceBottom = target.scrollHeight - (target.scrollTop + target.clientHeight);
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (numberOfEntries > (currentPage + 1) * limit && bottom && !pending) {
      const newPage = currentPage + 1;
      const updatedData = [...previousData, ...(listData || [])];

      this.setState({
        previousData: updatedData,
        currentPage: newPage
      });
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
    const { numberOfEntries, id } = this.props;

    console.log('SCROLLING ', id, page, limit, numberOfEntries);

    if (numberOfEntries >= page * limit) {
      await this.setState({
        currentPage: page - 1
      });

      return true;
    }

    return false;
  };

  /**
   * Render a guests table.
   *
   * @returns {Node}
   */
  renderTableWORKS() {
    const { previousData } = this.state;
    const { listData } = this.props;

    const list = [...previousData, ...(listData || [])];
    const updatedListData = list.map((v, i) => <li key={`data${i}`}>{v.insightsId}</li>);

    return (
      <div className="curiosity-pagination-scroll" style={{ height: `200px` }}>
        <div className="curiosity-pagination-scroll-list" onScroll={this.onScroll}>
          <ol>{updatedListData}</ol>
        </div>
      </div>
    );
  }

  renderTable() {
    const { previousData } = this.state;
    const { filterGuestsData, listData } = this.props;
    let updatedColumnHeaders = [];

    const updatedRows = [...previousData, ...(listData || [])].map(({ ...cellData }) => {
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
      <div className="curiosity-pagination-scroll" style={{ height: `200px` }}>
        <div className="curiosity-pagination-scroll-list" onScroll={this.onScroll}>
          <Table
            borders={false}
            variant={TableVariant.compact}
            className="curiosity-inventory-list"
            columnHeaders={updatedColumnHeaders}
            rows={updatedRows}
          />
        </div>
      </div>
    );
  }

  /**
   * Render a guest list table.
   *
   * @returns {Node}
   */
  render() {
    const { currentPage } = this.state;
    const { error, filterGuestsData, listData, pending, perPageDefault } = this.props;

    return (
      <div className={`fadein ${(error && 'blur') || ''}`}>
        {pending && currentPage === 0 && (
          <Loader
            variant="table"
            tableProps={{
              borders: false,
              colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
              rowCount: perPageDefault,
              variant: TableVariant.compact
            }}
          />
        )}
        {this.renderTable()}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{numberOfEntries: number, listData: Array, getHostsInventoryGuests: Function,
 *     filterGuestsData: object, pending: boolean, query: object, perPageDefault: number,
 *     id: string, error: boolean}}
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
  numberOfEntries: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  perPageDefault: PropTypes.number,
  query: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

/**
 * Default props.
 *
 * @type {{numberOfEntries: number, listData: Array, getHostsInventoryGuests: Function,
 *     filterGuestsData: Array, pending: boolean, perPageDefault: number, error: boolean}}
 */
GuestsList.defaultProps = {
  error: false,
  filterGuestsData: [],
  getHostsInventoryGuests: helpers.noop,
  numberOfEntries: 0,
  listData: [],
  pending: false,
  perPageDefault: 5
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
