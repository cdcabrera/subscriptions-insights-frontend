import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
/*
import {
  Table as PfTable,
  TableBody,
  TableHeader,
  TableVariant,
  sortable,
  SortByDirection,
  expandable,
  RowWrapper
} from '@patternfly/react-table';
*/
import _isEqual from 'lodash/isEqual';
import { rhsmApiTypes } from '../../types';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers, helpers } from '../../common';
import { connectTranslate, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';

/*
class InventoryList extends React.Component {
  state = {
    updatedRows: []
  };

  // the idea is to leverage js' ability to share an object across an array or objecty the use that to turn it on or off or update its parent property
  onCollapse = async ({ isOpen, rowDetail }) => {
    const { updatedRows } = this.state;
    const { rows } = this.props;
    const parentRows = (updatedRows.length && updatedRows) || rows;
    const rowIndex = parentRows.findIndex(v => v.id === rowDetail.id);

    parentRows[rowIndex].isOpen = isOpen;

    if (isOpen) {
      parentRows[rowIndex + 1].fullWidth = false;
      parentRows[rowIndex + 1].cells = [
        {
          title: <React.Fragment>parentIndex-{rowIndex}, testing elements</React.Fragment>
        }
      ];
    }

    this.setState({
      updatedRows: parentRows
    });



    /*
    if (isOpen) {
      const testPromise = () =>
        new Promise(resolve =>
          setTimeout(() => resolve(<React.Fragment>parentIndex-{rowIndex}, testing elements</React.Fragment>), 2000)
        );
      const results = await testPromise();
      // const updatedChildRow = childRow || {
      updatedChildRow = {
        parent: rowIndex,
        cells: [
          {
            title: results
          }
        ]
      };

      parentRows.splice(rowIndex + 1, 0, updatedChildRow);
    }

    this.setState({
      childRows: updatedChildRow,
      updatedRows: parentRows
    });
    * /
  };


  onSort = (event, index, direction) => {
    const { updatedRows } = this.state;
    const { rows } = this.props;

    const sr = (updatedRows.length && updatedRows) || rows;
    const sortedRows = sr.sort((a, b) => (a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0));

    this.setState({
      sortBy: {
        index,
        direction
      },
      updatedRows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    });
  };

  render() {
    const { sortBy, updatedRows } = this.state;
    const { columnHeaders, rows } = this.props;

    return (
      <Table
        summary="test summary"
        aria-label="Compact expandable table"
        variant={TableVariant.compact}
        onCollapse={(event, rowKey, isOpen, rowDetail, b, c) => this.onCollapse({ event, rowKey, isOpen, rowDetail, b, c })}
        sortBy={sortBy}
        rows={(updatedRows.length && updatedRows) || rows}
        cells={columnHeaders}
        rowWrapper={({ ...props }) => <RowWrapper {...props} className="curiosity-row" />}
      >
        <TableHeader />
        <TableBody />
      </Table>
    );
  }
}

InventoryList.propTypes = {
  columnHeaders: PropTypes.array,
  rows: PropTypes.array
};

InventoryList.defaultProps = {
  columnHeaders: [
    {
      title: 'Header cell',
      // cellFormatters: [expandable],
      transforms: [sortable]
    },
    'Branches',
    'Pull requests',
    ''
  ],
  rows: [
    {
      id: 'one',
      // isOpen: false,
      cells: ['parent - 1', 'two', 'three', 'four']
    },
    {
      parent: 0,
      fullWidth: true,
      cells: []
    },
    {
      id: 'two',
      isOpen: false,
      cells: ['parent - 2', 'two', 'three', 'four']
    },
    {
      parent: 2,
      fullWidth: true,
      cells: []
    },
    {
      id: 'three',
      // isOpen: false,
      cells: ['parent - 3', 'two', 'three', 'four']
    },
    {
      parent: 4,
      fullWidth: true,
      // props: { className: 'hidden' },
      // cells: [{ title: '', props: { className: 'hidden' } }]
      cells: []
    }
  ]
};
*/

class InventoryList extends React.Component {
  componentDidMount() {
    this.onUpdateInventoryData();
  }

  componentDidUpdate(prevProps) {
    const { query, productId } = this.props;
    // console.log('UPDATE >>>', productId !== prevProps.productId || !_isEqual(query, prevProps.query));
    if (productId !== prevProps.productId || !_isEqual(query, prevProps.query)) {
      this.onUpdateInventoryData();
    }
  }

  onUpdateInventoryData = () => {
    const { getHostsInventory, query, isDisabled, productId } = this.props;

    if (!isDisabled && productId) {
      getHostsInventory(productId, query);
    }
  };

  render() {
    const { fulfilled, inventoryData } = this.props;
    console.log('INV >>>', fulfilled, inventoryData);

    return (
      <Table
        className="curiosity-inventory-list"
        isLoaded={fulfilled}
        columnHeaders={[{ title: 'Name' }, 'Infrastructure', 'Sockets/Cores', 'Last seen']}
        rows={inventoryData.map(({ displayName, hardwareType, sockets, cores, lastSeen }) => ({
          cells: [displayName, hardwareType, `${sockets}/${cores}`, lastSeen],
          expandedContent: <React.Fragment>hello</React.Fragment>
        }))}
      />
    );

    /*
    return (
      <Table>
        {inventoryData.map(data => (
          <TableRow onclick={() => {}}>
            <TableCell th={<React.Fragment>hello</React.Fragment>} props={{}}>
              {data.lastSeen}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    );
     */

    /*
    return <Table columnHeaders={[

    ]} rows={inventoryData} />;

     */

    /*
    return (
      <Table rows={}>
        <TableHeader>
          {}
        </TableHeader>
        <TableBody>
          {inventoryData.map(data => <TableRow><TableCell value={data.lastSeen} /></TableRow>)}
        </TableBody>
      </Table>
    );


    return <React.Fragment>{JSON.stringify(inventoryData)}</React.Fragment>;

     */
  }
}

InventoryList.propTypes = {
  // columnHeaders: PropTypes.array,
  // rows: PropTypes.array,
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  getHostsInventory: PropTypes.func,
  isDisabled: PropTypes.bool,
  inventoryData: PropTypes.array,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  query: PropTypes.object,
  t: PropTypes.func,
  viewId: PropTypes.string
};

InventoryList.defaultProps = {
  error: false,
  fulfilled: false,
  getHostsInventory: helpers.noop,
  inventoryData: [],
  isDisabled: helpers.UI_DISABLED_TABLE,
  pending: false,
  query: {},
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
