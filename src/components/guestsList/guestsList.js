import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { helpers } from '../../common';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { translate } from '../i18n/i18n';

class GuestsList extends React.Component {
  componentDidMount() {
    this.onUpdateData();
  }

  onUpdateData = () => {
    const { getHostsInventoryGuests, listQuery, listQueryId, isDisabled } = this.props;

    if (!isDisabled && listQueryId) {
      getHostsInventoryGuests(listQueryId, listQuery);
    }
  };

  renderTable() {
    const { listData, t } = this.props;

    return (
      <Table
        variant={TableVariant.compact}
        borders={false}
        columnHeaders={[
          t('curiosity-inventory.headerName'),
          t('curiosity-inventory.headerUUID'),
          t('curiosity-inventory.headerLastSeen')
        ]}
        rows={listData.map(({ displayName, insightsId, lastSeen }) => ({
          cells: [displayName, insightsId, lastSeen]
        }))}
      />
    );
  }

  /**
   * Render a guest list table.
   *
   * @returns {Node}
   */
  render() {
    const { error, loaderRowCount, pending } = this.props;

    return (
      <div className={`curiosity-inventory-list-wrapper fadein ${(error && 'blur') || ''}`}>

          <Loader
            variant="table"
            tableProps={{
              borders: false,
              className: 'curiosity-inventory-list',
              colCount: 3,
              rowCount: loaderRowCount,
              variant: TableVariant.compact
            }}
          />

      </div>
    );
  }
}

GuestsList.propTypes = {
  error: PropTypes.bool,
  getHostsInventoryGuests: PropTypes.func,
  isDisabled: PropTypes.bool,
  loaderRowCount: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  // productId: PropTypes.string,
  listQuery: PropTypes.object.isRequired,
  listQueryId: PropTypes.string.isRequired,
  t: PropTypes.func
};

GuestsList.defaultProps = {
  error: false,
  getHostsInventoryGuests: helpers.noop,
  loaderRowCount: 3,
  listData: [],
  isDisabled: helpers.UI_DISABLED_TABLE,
  pending: false,
  t: translate
  // viewId: 'inventoryGuestList'
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
