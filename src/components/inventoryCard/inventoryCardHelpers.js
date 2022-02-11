import React from 'react';
import { cellWidth as PfCellWidth, SortByDirection, wrappable } from '@patternfly/react-table';
import _camelCase from 'lodash/camelCase';
import { Tooltip } from '../tooltip/tooltip';
import { translate } from '../i18n/i18n';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';

// ToDo: review setting up a transformed cell cache for already transformed cells.

/**
 * Apply product inventory config properties consistently.
 *
 * @param {Function|string|number} prop
 * @param {object} options
 * @param {Array|object} options.params
 * @returns {Node|string|number|undefined}
 */
const applyConfigProperty = (prop, { params = [] } = {}) => {
  let updatedProp = prop;

  if (typeof prop === 'function') {
    updatedProp = prop(...((Array.isArray(params) && params) || [params]));
  }

  if (typeof updatedProp === 'string' || typeof updatedProp === 'number' || React.isValidElement(updatedProp)) {
    return updatedProp;
  }

  return undefined;
};

/**
 * Apply header and row cell product filters.
 *
 * @param {Array} filters
 * @param {object} cellData
 * @param {object} session
 * @returns {{bodyCells: Array, headerCells: Array}}
 */
const applyHeaderRowCellFilters = (filters = [], cellData = {}, session = {}) => {
  const headerCells = [];
  const bodyCells = [];

  filters.forEach(({ id, cell, cellWidth, header, onSort, sortId, sortActive, sortDirection, tooltip, transforms }) => {
    const headerCellUpdated = { title: translate('curiosity-inventory.header', { context: id }) };
    const bodyCellUpdated = { title: '' };

    // set filtered base header and body cells, or if filter doesn't exist skip
    if (cellData[id]) {
      headerCellUpdated.title = cellData[id]?.title ?? id;
      bodyCellUpdated.title = cellData[id]?.value ?? '';
    } else {
      return;
    }

    // set header cell title
    if (header) {
      const updatedHeaderCellTitle = applyConfigProperty(header, { params: cellData });
      if (updatedHeaderCellTitle) {
        headerCellUpdated.title = updatedHeaderCellTitle;
      }
    }

    // set header cell tooltip
    if (tooltip) {
      const updatedTooltip = applyConfigProperty(tooltip, { params: cellData });
      if (updatedTooltip) {
        headerCellUpdated.title = <Tooltip content={updatedTooltip}>hey</Tooltip>;
      }
    }

    // set header cell transforms
    if (headerCellUpdated) {
      headerCellUpdated.transforms = [];

      if (Array.isArray(transforms)) {
        headerCellUpdated.transforms = headerCellUpdated.transforms.concat([...transforms]);
      }

      if (typeof cellWidth === 'number') {
        headerCellUpdated.transforms.push(PfCellWidth(cellWidth));
      }
    }

    // set header cell onSort
    if (typeof onSort === 'function') {
      headerCellUpdated.onSort = obj => onSort({ ...cellData }, { ...obj, id: sortId || id });
      headerCellUpdated.sortActive = sortActive;
      headerCellUpdated.sortDirection = sortDirection;
    }

    // set body cell title
    if (cell) {
      const updatedBodyCellTitle = applyConfigProperty(cell, { params: [{ ...cellData }, { ...session }] });
      if (updatedBodyCellTitle) {
        bodyCellUpdated.title = updatedBodyCellTitle;
      }
    }

    headerCells.push(headerCellUpdated);
    bodyCells.push(bodyCellUpdated);
  });

  return {
    headerCells,
    bodyCells
  };
};

/**
 * Apply sort filter to filters.
 *
 * @param {object} params
 * @param {{ onSort: Function, sortActive: boolean, sortDirection: string, isSortDefault: boolean,
 *     sortDefaultInitialDirection: string }} params.filter
 * @param {Function} params.onSort
 * @param {object} params.query
 * @returns {object}
 */
const applySortFilters = ({ filter = {}, onSort, query = {} }) => {
  const { id, sortId } = filter;
  const updatedId = sortId || id;
  const updatedFilter = { ...filter };
  const hasSort = updatedFilter.onSort || onSort;

  if (!updatedFilter.onSort && onSort) {
    updatedFilter.onSort = onSort;
  }

  // set fallback for the active sorted column based on query
  if (
    hasSort &&
    typeof updatedFilter.sortActive !== 'boolean' &&
    query?.[RHSM_API_QUERY_TYPES.SORT] &&
    (query?.[RHSM_API_QUERY_TYPES.SORT] === updatedId || _camelCase(query?.[RHSM_API_QUERY_TYPES.SORT]) === updatedId)
  ) {
    updatedFilter.sortActive = true;
  }

  // set sort direction
  if (hasSort && !updatedFilter.sortDirection && query?.[RHSM_API_QUERY_TYPES.DIRECTION]) {
    switch (query?.[RHSM_API_QUERY_TYPES.DIRECTION]) {
      case SORT_DIRECTION_TYPES.DESCENDING:
        updatedFilter.sortDirection = SortByDirection.desc;
        break;
      default:
        updatedFilter.sortDirection = SortByDirection.asc;
        break;
    }
  }

  if (
    hasSort &&
    !updatedFilter.sortActive &&
    !query?.[RHSM_API_QUERY_TYPES.SORT] &&
    updatedFilter.isSortDefault === true
  ) {
    updatedFilter.sortActive = true;

    if (updatedFilter.sortDefaultInitialDirection) {
      updatedFilter.sortDirection = updatedFilter.sortDefaultInitialDirection;
    }
  }

  return updatedFilter;
};

const applyWrappableFilters = ({ filter = {} }) => {
  const updatedFilter = { ...filter };

  if (Array.isArray(updatedFilter.transforms)) {
    updatedFilter.transforms.push(wrappable);
  } else {
    updatedFilter.transforms = [wrappable];
  }

  return updatedFilter;
};

/**
 * Apply additional properties to filters.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {Function} params.onSort
 * @param {object} params.query
 * @returns {Array}
 */
const parseInventoryFilters = ({ filters = [], onSort, query = {} }) =>
  [...filters].map(filter => {
    const updatedFilter = { ...filter };

    if (updatedFilter.isSortable) {
      Object.assign(updatedFilter, applySortFilters({ filter: updatedFilter, onSort, query }));
    }

    if (updatedFilter.isWrappable) {
      Object.assign(updatedFilter, applyWrappableFilters({ filter: updatedFilter }));
    }

    return updatedFilter;
  });

/**
 * Parse and return formatted/filtered table cells, and apply table filters.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {object} params.cellData
 * @param {object} params.session
 * @returns {{columnHeaders: Array, cells: Array, data: object}}
 */
const parseRowCellsListData = ({ filters = [], cellData = {}, session = {} }) => {
  const updatedColumnHeaders = [];
  const updatedCells = [];
  const allCells = {};

  // Apply basic translation and value
  Object.entries(cellData).forEach(([key, value = '']) => {
    allCells[key] = {
      title: translate('curiosity-inventory.header', { context: key }),
      value
    };

    updatedColumnHeaders.push(allCells[key].title);
    updatedCells.push(value || '...');
  });

  // Apply filters to header and cell values
  if (filters?.length && Object.keys(allCells).length) {
    updatedColumnHeaders.length = 0;
    updatedCells.length = 0;

    const { headerCells = [], bodyCells = [] } = applyHeaderRowCellFilters(filters, allCells, session);

    updatedColumnHeaders.push(...headerCells);
    updatedCells.push(...bodyCells);
  }

  return {
    columnHeaders: updatedColumnHeaders,
    cells: updatedCells,
    data: { ...allCells }
  };
};

const inventoryCardHelpers = {
  applyConfigProperty,
  applyHeaderRowCellFilters,
  applySortFilters,
  applyWrappableFilters,
  parseInventoryFilters,
  parseRowCellsListData
};

export {
  inventoryCardHelpers as default,
  inventoryCardHelpers,
  applyConfigProperty,
  applyHeaderRowCellFilters,
  applySortFilters,
  applyWrappableFilters,
  parseInventoryFilters,
  parseRowCellsListData
};
