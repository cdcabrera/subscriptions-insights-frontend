import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/TableToolbar';
// import { useSession } from '../authentication/authenticationContext';
/*
import {
  useProduct,
  useProductInventoryHostsConfig,
  useProductInventoryHostsQuery
} from '../productView/productViewContext';
 */
import { helpers } from '../../common';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
// import { InventoryGuests } from '../inventoryGuests/inventoryGuests';
import {
  InventoryCardContext,
  useGetInstancesInventory,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
} from './_inventoryCardContext';
// import { inventoryCardHelpers } from './_inventoryCardHelpers';
import { Pagination } from '../pagination/pagination';
import { ToolbarFieldDisplayName } from '../toolbar/toolbarFieldDisplayName';
// import { paginationHelpers } from '../pagination/paginationHelpers';
// import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * Instances, and Subscriptions base inventory card.
 *
 * @memberof Components
 * @module InventoryCard
 * @property {module} InventoryCardContext
 * @property {module} InventoryCardHelpers
 */

/**
 * ToDo: Update table component and review the deep comparison use on data
 * The newer table wrapper should remove the need to use the deep comparison,
 * temporarily using to allow the move from the deprecated inventory.
 */
/**
 * Set up inventory cards. Expand filters with base settings.
 *
 * @param {object} props
 * @param {React.ReactNode} props.cardActions
 * @param {boolean} props.isDisabled
 * @param {number} props.perPageDefault
 * @param {Function} props.t
 * @param {Function} props.useGetInventory
 * @param {Function} props.useParseFiltersSettings
 * @param props.useOnPage
 * @param props.useOnColumnSort
 * @fires onColumnSort
 * @fires onPage
 * @returns {React.ReactNode}
 */
const InventoryCard = ({
  cardActions,
  isDisabled,
  perPageDefault,
  t,
  useGetInventory: useAliasGetInventory,
  useOnPage: useAliasOnPage,
  useOnColumnSort: useAliasOnColumnSort,
  // useProduct: useAliasProduct,
  // useProductInventoryConfig: useAliasProductInventoryConfig,
  // useProductInventoryQuery: useAliasProductInventoryQuery,
  // useSession: useAliasSession,
  useParseFiltersSettings: useAliasParseFiltersSettings
}) => {
  /*
  const [updatedColumnsRows, setUpdatedColumnsRows] = useState({ columnHeaders: [], rows: [] });
  const sessionData = useAliasSession();
  const query = useAliasProductInventoryQuery();
  const { productId } = useAliasProduct();
  const { filters: filterInventoryData, settings } = useAliasProductInventoryConfig();
  */
  const onPage = useAliasOnPage();
  const onColumnSort = useAliasOnColumnSort();
  const { filtersSettings } = useAliasParseFiltersSettings({ isDisabled });
  const {
    error,
    pending,
    dataSetColumnHeaders = [],
    dataSetRows = [],
    // meta = {},
    resultsCount,
    resultsOffset,
    resultsPerPage = perPageDefault
  } = useAliasGetInventory({ isDisabled });
  // const { data: listData = [], meta = {} } = data;
  // const itemCount = meta?.count;

  if (isDisabled || !filtersSettings) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

  // const updatedPerPage = query[RHSM_API_QUERY_SET_TYPES.LIMIT] || perPageDefault;
  // const updatedOffset = query[RHSM_API_QUERY_SET_TYPES.OFFSET];
  // const isLastPage = paginationHelpers.isLastPage(updatedOffset, updatedPerPage, itemCount);

  /*
  // Set an updated key to force refresh minHeight
  const minHeightContentRefreshKey =
    (fulfilled === true && itemCount < updatedPerPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (fulfilled === true && isLastPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (error === true && `bodyMinHeight-${updatedPerPage}-resize`) ||
    `bodyMinHeight-${updatedPerPage}`;
  */

  return (
    <InventoryCardContext.Provider key={`inventoryCard-${filtersSettings}`} value={filtersSettings}>
      <Card className="curiosity-inventory-card">
        <MinHeight key="headerMinHeight">
          <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
            {cardActions}
            <CardActions className={(!resultsCount && 'transparent') || ''} aria-hidden={!resultsCount || false}>
              <Pagination
                isCompact
                isDisabled={pending || error}
                itemCount={resultsCount}
                offset={resultsOffset}
                onPage={onPage}
                onPerPage={onPage}
                perPage={resultsPerPage}
              />
            </CardActions>
          </CardHeader>
        </MinHeight>
        <MinHeight key="bodyMinHeight">
          <CardBody>
            <div className={(error && 'blur') || (pending && 'fadein') || ''}>
              {pending && (
                <Loader
                  variant="table"
                  tableProps={{
                    className: 'curiosity-inventory-list',
                    colCount: filtersSettings?.length || 1,
                    colWidth: (filtersSettings?.length && filtersSettings.map(({ cellWidth }) => cellWidth)) || [],
                    rowCount: dataSetRows?.length || resultsPerPage,
                    variant: TableVariant.compact
                  }}
                />
              )}
              {!pending && (
                <Table
                  className="curiosity-inventory-list"
                  isBorders
                  onSort={onColumnSort}
                  columnHeaders={dataSetColumnHeaders}
                  rows={dataSetRows}
                />
              )}
            </div>
          </CardBody>
        </MinHeight>
        <MinHeight key="footerMinHeight">
          <CardFooter
            className={(error && 'hidden') || (!resultsCount && 'transparent') || ''}
            aria-hidden={error || !resultsCount || false}
          >
            <TableToolbar isFooter>
              <Pagination
                dropDirection="up"
                isDisabled={pending || error}
                itemCount={resultsCount}
                offset={resultsOffset}
                onPage={onPage}
                onPerPage={onPage}
                perPage={resultsPerPage}
              />
            </TableToolbar>
          </CardFooter>
        </MinHeight>
      </Card>
    </InventoryCardContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{cardActions: React.ReactNode, useSession: Function, useOnPage: Function, useProduct: Function, t: Function,
 *     perPageDefault: number, isDisabled: boolean, useProductInventoryConfig: Function, useGetInventory: Function,
 *     useOnColumnSort: Function, useProductInventoryQuery: Function}}
 */
InventoryCard.propTypes = {
  cardActions: PropTypes.node,
  isDisabled: PropTypes.bool,
  perPageDefault: PropTypes.number,
  t: PropTypes.func,
  useGetInventory: PropTypes.func,
  useOnPage: PropTypes.func,
  useOnColumnSort: PropTypes.func,
  useParseFiltersSettings: PropTypes.func
  // useProduct: PropTypes.func,
  // useProductInventoryConfig: PropTypes.func,
  // useProductInventoryQuery: PropTypes.func,
  // useSession: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{cardActions: React.ReactNode, useSession: Function, useOnPage: Function, useProduct: Function, t: translate,
 *     perPageDefault: number, isDisabled: boolean, useProductInventoryConfig: Function, useGetInventory: Function,
 *     useOnColumnSort: Function, useProductInventoryQuery: Function}}
 */
InventoryCard.defaultProps = {
  cardActions: (
    <CardHeaderMain>
      <ToolbarFieldDisplayName />
    </CardHeaderMain>
  ),
  isDisabled: helpers.UI_DISABLED_TABLE_INSTANCES,
  perPageDefault: 10,
  t: translate,
  useGetInventory: useGetInstancesInventory,
  useOnPage: useOnPageInstances,
  useOnColumnSort: useOnColumnSortInstances,
  useParseFiltersSettings: useParseInstancesFiltersSettings
  // useProduct,
  // useProductInventoryConfig: useProductInventoryHostsConfig,
  // useProductInventoryQuery: useProductInventoryHostsQuery,
  // useSession
};

export { InventoryCard as default, InventoryCard };
