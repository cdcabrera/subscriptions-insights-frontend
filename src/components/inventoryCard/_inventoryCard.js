import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/TableToolbar';
import { helpers } from '../../common';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import {
  InventoryCardContext,
  useGetInstancesInventory,
  useInventoryCardActions,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
} from './_inventoryCardContext';
import { Pagination } from '../pagination/pagination';
import { translate } from '../i18n/i18n';

/**
 * Instances, and Subscriptions base inventory table card.
 *
 * @memberof Components
 * @module InventoryCard
 * @property {module} InventoryCardContext
 * @property {module} InventoryCardHelpers
 */

/**
 * Set up inventory cards. Expand filters with base settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useGetInventory
 * @param {Function} props.useInventoryCardActions
 * @param {Function} props.useParseFiltersSettings
 * @param {Function} props.useOnPage
 * @param {Function} props.useOnColumnSort
 * @fires onColumnSort
 * @fires onPage
 * @returns {React.ReactNode}
 */
const InventoryCard = ({
  isDisabled,
  t,
  useGetInventory: useAliasGetInventory,
  useInventoryCardActions: useAliasInventoryCardActions,
  useOnPage: useAliasOnPage,
  useOnColumnSort: useAliasOnColumnSort,
  useParseFiltersSettings: useAliasParseFiltersSettings
}) => {
  const updatedActionDisplay = useAliasInventoryCardActions();
  const onPage = useAliasOnPage();
  const onColumnSort = useAliasOnColumnSort();
  const { filtersSettings } = useAliasParseFiltersSettings({ isDisabled });
  const {
    error,
    pending,
    dataSetColumnHeaders = [],
    dataSetRows = [],
    resultsCount,
    resultsOffset,
    resultsPerPage
  } = useAliasGetInventory({ isDisabled });

  if (isDisabled || !filtersSettings) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

  return (
    <InventoryCardContext.Provider key={`inventoryCard-${filtersSettings}`} value={filtersSettings}>
      <Card className="curiosity-inventory-card">
        <MinHeight key="headerMinHeight">
          <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
            {updatedActionDisplay}
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
 * @type {{useOnPage: Function, useParseFiltersSettings: Function, t: Function, useInventoryCardActions: Function,
 *     isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCard.propTypes = {
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useGetInventory: PropTypes.func,
  useInventoryCardActions: PropTypes.func,
  useOnPage: PropTypes.func,
  useOnColumnSort: PropTypes.func,
  useParseFiltersSettings: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnPage: Function, useParseFiltersSettings: Function, t: translate, useInventoryCardActions: Function,
 *     isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCard.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_INSTANCES,
  t: translate,
  useGetInventory: useGetInstancesInventory,
  useInventoryCardActions,
  useOnPage: useOnPageInstances,
  useOnColumnSort: useOnColumnSortInstances,
  useParseFiltersSettings: useParseInstancesFiltersSettings
};

export { InventoryCard as default, InventoryCard };
