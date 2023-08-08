import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_SET_TYPES, RHSM_API_RESPONSE_META_TYPES } from '../../services/rhsm/rhsmConstants';
// import { helpers } from '../../common';

const normalizeInventorySettings = ({ filters = [], settings = {}, productId } = {}) => {
  const updatedFilters = [];

  // filters.forEach(({ id, header, cell, cellWidth, isSortable, isWrappable, ...rest }) => {
  // filters.forEach(({ metric, header, content, width, isSort, isWrap, ...rest }) => {
  filters.forEach(({ metric, header, cell, ...rest }) => {
    let updatedHeader;
    let updatedCell;

    if (typeof header === 'function' && header) {
      updatedHeader = header;
    } else if (header) {
      updatedHeader = () => header;
    } else {
      updatedHeader = () => {
        console.log('>>> HEADER CONTENT', metric, productId);
        return translate('curiosity-inventory.header', { context: [metric, productId] });
      };
    }

    if (typeof cell === 'function' && cell) {
      updatedCell = (...args) => cell(...args);
    } else if (cell) {
      updatedCell = () => {
        console.log('>>> CELL cell', cell);
        return cell;
      };
    } else {
      /*
      updatedCell = () => {
        console.log('>>> CELL CONTENT', metric, productId);
        return translate('curiosity-inventory.cell', { context: [metric, productId] });
      };
      */
      updatedCell = ({ [metric]: displayValue }) => {
        console.log('>>>> CELL FALLBACK', displayValue);
        return displayValue;
      };
    }

    updatedFilters.push({
      metric,
      ...rest,
      header: updatedHeader,
      cell: updatedCell
    });
  });

  return {
    filters: updatedFilters,
    settings
  };
};

const parseInventoryResponse = (
  { data = {}, filters = [], query = {}, session = {} } = {}
  // {
  // perPageDefault = 10
  // normalizeInventorySettings: aliasNormalizeInventorySettings = normalizeInventorySettings
  // } = {}
) => {
  // const { data: listData = [], meta = {} } = (data?.length === 1 && data[0]) || data || {};
  const { data: listData = [], meta = {} } = data;
  const resultsCount = meta[RHSM_API_RESPONSE_META_TYPES.COUNT];
  const resultsOffset = query[RHSM_API_QUERY_SET_TYPES.OFFSET];
  const resultsPerPage = query[RHSM_API_QUERY_SET_TYPES.LIMIT];
  const dataSetColumnHeaders = [];
  const dataSetRows = [];
  const columnData = {};

  // console.log('>>>>> HELPER', listData, meta, filters);

  listData.forEach(rowData => {
    const dataSetRow = [];
    filters.forEach(({ metric, cell, ...rest }) => {
      // const updatedCell = (...args) => cell({ ...rowData }, { ...session }, { ...meta }, ...args);
      const updatedCell = cell({ ...rowData }, { ...session }, { ...meta });
      dataSetRow.push({ metric, ...rest, content: updatedCell });

      columnData[metric] ??= [];
      columnData[metric].push(updatedCell);
    });

    dataSetRows.push({ cells: dataSetRow });
  });

  filters.forEach(({ metric, header, ...rest }) => {
    // const updatedHeader = (...args) => header({ ...columnData[metric] }, { ...session }, { ...meta }, ...args);
    const updatedHeader = header({ ...columnData[metric] }, { ...session }, { ...meta });
    dataSetColumnHeaders.push({ ...rest, content: updatedHeader });
  });

  console.log('>>>>> dataSetColumnHeaders', dataSetColumnHeaders);
  console.log('>>>>> dataSetRows', dataSetRows);

  return {
    dataSetColumnHeaders,
    dataSetRows,
    resultsCount,
    resultsOffset,
    resultsPerPage
  };
};

const inventoryCardHelpers = {
  normalizeInventorySettings,
  parseInventoryResponse
};

export { inventoryCardHelpers as default, inventoryCardHelpers, normalizeInventorySettings, parseInventoryResponse };
