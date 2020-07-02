import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button, SelectVariant } from '@patternfly/react-core';
import {
  Table as PfTable,
  TableBody,
  TableHeader,
  TableVariant,
  sortable,
  SortByDirection
} from '@patternfly/react-table';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/esm/SkeletonTable';
import _isEqual from 'lodash/isEqual';
import moment from 'moment';
import { helpers } from '../../common';

class Table extends React.Component {
  state = {
    updatedColumnHeaders: null,
    updatedRows: null
  };

  componentDidMount() {
    const { updatedRows } = this.state;

    if (updatedRows === null) {
      this.setRowData();
    }
  }

  componentDidUpdate(prevProps) {
    const { columnHeaders, rows } = this.props;

    if (!_isEqual(prevProps.rows, rows) || !_isEqual(prevProps.columnHeaders, columnHeaders)) {
      this.setRowData();
    }
  }

  onCollapseOLD = async ({ isOpen, rowDetail }) => {
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
  };

  onCollapse = ({ event, index, isOpen, data }) => {
    const { updatedRows } = this.state;
    console.log('CHECK ON COLLAPSE>>>', index, isOpen, data);

    updatedRows[index].isOpen = isOpen;

    if (isOpen) {
      updatedRows[index + 1].fullWidth = false;
    }

    this.setState({
      updatedRows
    });
  };

  onRowClick = ({}) => {};

  onSort = ({}) => {};

  setRowData() {
    const { columnHeaders, rows } = this.props;
    const updatedColumnHeaders = [];
    const updatedRows = [];

    columnHeaders.forEach(columnHeader => {
      updatedColumnHeaders.push(columnHeader);
    });

    // expandedContent: PropTypes.node,
    // cells: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])),
    // isExpanded: PropTypes.bool,
    // onClick: PropTypes.bool,
    // rowActions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node]))
    /*
    {
      parent: 4,
        fullWidth: true,
      // props: { className: 'hidden' },
      // cells: [{ title: '', props: { className: 'hidden' } }]
      cells: []
    }
    */

    rows.forEach(({ expandedContent, cells, isExpanded, onClick, rowActions }) => {
      const rowObj = {
        cells: []
      };
      updatedRows.push(rowObj);

      if (expandedContent) {
        rowObj.isOpen = isExpanded || false;

        updatedRows.push({
          parent: updatedRows.length - 1,
          fullWidth: true,
          cells: [{ title: expandedContent }]
          // expandedContent
        });
      }

      cells.forEach(cell => {
        if (cell.cell) {
          const { cell: contentCell, ...settings } = cell;
          // rowObj.cells.push({ title: this.checkCellValue(contentCell), ...settings });
          rowObj.cells.push({ title: contentCell, ...settings });
        } else {
          rowObj.cells.push({ title: cell });
        }
      });
    });

    console.log('CHECK ROWS>>>', updatedRows);

    this.setState({
      updatedColumnHeaders,
      updatedRows
    });
  }

  /*
  checkCellValue = value => {
    if (helpers.isDate(value)) {
      const momentDate = moment.utc(value);
      // return momentDate.format(dateHelpers.inventoryFormats.yearShort);
      return momentDate.fromNow();
    }

    return value;
  };
  */

  renderTable() {
    const { updatedColumnHeaders, updatedRows } = this.state;
    const { tableAriaLabel, tableCaption, tableSummary, tableVariant } = this.props;

    const emptyTable = {
      title: 'empty',
      props: { colSpan: updatedColumnHeaders.length }
    };

    /*
    const actionResolver = (rowData, { rowIndex }) => {
      return [
        {
          title: 'Some action',
          onClick: (event, rowId, rowData, extra) => {
            console.log(`clicked on Some action, on row ${rowId} of type ${rowData.type}`);
          }
        }
      ];
    };

    const areActionsDisabled = (rowData, { rowIndex }) => {
      return rowIndex === 3;
    };
    */

    return (
      <PfTable
        // className={className}
        aria-label={tableAriaLabel}
        caption={tableCaption}
        summary={tableSummary}
        variant={tableVariant}
        onCollapse={(event, index, isOpen, data) => this.onCollapse({ event, index, isOpen, data })}
        // onSort={(event, index, direction, data) => this.onSort({ event, index, direction, data })}
        // sortBy={sortBy}
        // actionResolver={actionResolver}
        // areActionsDisabled={areActionsDisabled}
        rows={(updatedRows?.length && updatedRows) || []}
        cells={updatedColumnHeaders || []}
      >
        <TableHeader />
        <TableBody onRowClick={(event, index, rowProps, data) => this.onRowClick({ event, index, rowProps, data })} />
      </PfTable>
    );
  }

  render() {
    const { isLoaded, loadSkeleton } = this.props;

    return (
      <Grid guttter="sm" className="ins-inventory-list">
        <GridItem span={12}>
          {(isLoaded && this.renderTable()) || (
            <SkeletonTable colSize={loadSkeleton.columnCount} rowSize={loadSkeleton.rowCount} />
          )}
        </GridItem>
      </Grid>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
  columnHeaders: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.shape({
        title: PropTypes.node,
        onSort: PropTypes.func
      })
    ])
  ).isRequired,
  isLoaded: PropTypes.bool,
  loadSkeleton: PropTypes.shape({ columnCount: PropTypes.number, rowCount: PropTypes.number }),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      expandedContent: PropTypes.node,
      cells: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.node,
          PropTypes.shape({
            cell: PropTypes.node
          })
        ])
      ),
      isExpanded: PropTypes.bool,
      onClick: PropTypes.bool,
      rowActions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node]))
    })
  ),
  tableAriaLabel: PropTypes.string,
  tableCaption: PropTypes.string,
  tableSummary: PropTypes.string,
  tableVariant: PropTypes.oneOf([...Object.values(TableVariant)])
};

Table.defaultProps = {
  className: null,
  isLoaded: false,
  loadSkeleton: { columnCount: 5, rowCount: 10 },
  rows: [],
  tableAriaLabel: 'Compact table.',
  tableCaption: null,
  tableSummary: 'A generated table with one level of column headers.',
  tableVariant: TableVariant.compact
};

export { Table as default, Table };
