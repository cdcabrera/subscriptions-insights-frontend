import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { helpers } from '../../common';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { inventoryListHelpers } from '../inventoryList/inventoryListHelpers';

class GuestsList extends React.Component {
  componentDidMount() {
    this.onUpdateData();
  }

  /*
  componentDidUpdate(prevProps) {
    const { query, queryId } = this.props;

    if (queryId !== prevProps.queryId || !_isEqual(query, prevProps.query)) {
      this.onUpdateData();
    }
  }
  */

  onUpdateData = () => {
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
        cellData: { ...cellData }
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
    const { error, filterGuestsData, listData, loaderRowCount, pending } = this.props;

    return (
      <div className={`curiosity-inventory-list-wrapper fadein ${(error && 'blur') || ''}`}>
        {pending && (
          <Loader
            variant="table"
            tableProps={{
              borders: false,
              className: 'curiosity-inventory-guestlist',
              colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
              rowCount: loaderRowCount,
              variant: TableVariant.compact
            }}
          />
        )}
        {!pending && this.renderTable()}
      </div>
    );
  }
}

GuestsList.propTypes = {
  error: PropTypes.bool,
  filterGuestsData: PropTypes.arrayOf(
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
  getHostsInventoryGuests: PropTypes.func,
  isDisabled: PropTypes.bool,
  loaderRowCount: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  query: PropTypes.object.isRequired,
  queryId: PropTypes.string.isRequired
};

GuestsList.defaultProps = {
  error: false,
  filterGuestsData: [],
  getHostsInventoryGuests: helpers.noop,
  loaderRowCount: 5,
  listData: [],
  isDisabled: helpers.UI_DISABLED_TABLE,
  pending: false
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
