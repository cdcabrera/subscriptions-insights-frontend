import React from 'react';
import PropTypes from 'prop-types';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
import {
  useProduct,
  useProductInventoryInstancesQuery,
  useProductInventoryInstancesConfig
} from '../productView/productViewContext';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { paginationHelpers } from '../pagination/paginationHelpers';
import { MinHeight } from '../minHeight/minHeight';
import { ToolbarFieldDisplayName } from '../toolbar/toolbarFieldDisplayName';
import Pagination from '../pagination/pagination';
import { Loader } from '../loader/loader';
import {helpers} from "../../common/helpers";
import translate from "../i18n/i18n";

/**
 * An inventory component.
 *
 * @param root0
 * @param root0.useProduct
 * @param root0.useProductInventoryInstancesConfig
 * @param root0.useProductInventoryInstancesQuery
 * @returns {null}
 */
const InventoryList = ({
  isDisabled,
  t,
  useInventorySelector: useAliasInventorySelector,
  useProduct: useAliasProduct,
  useProductInventoryInstancesConfig: useAliasProductInventoryInstancesConfig,
  useProductInventoryInstancesQuery: useAliasProductInventoryInstancesQuery
}) => {
  const { viewId } = useAliasProduct();
  const query = useAliasProductInventoryInstancesQuery();
  const { settings, filters } = useAliasProductInventoryInstancesConfig();
  const { error, fulfilled, pending, listData = [] } = useAliasInventorySelector();

  /*
  const {
    error,
    filterInventoryData,
    fulfilled,
    isDisabled,
    itemCount,
    listData,
    pending,
    perPageDefault,
    t
  }
  */

  if (isDisabled) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

  const updatedPerPage = query[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;
  const updatedOffset = query[RHSM_API_QUERY_TYPES.OFFSET];
  const isLastPage = paginationHelpers.isLastPage(updatedOffset, updatedPerPage, itemCount);

  // Set an updated key to force refresh minHeight
  const minHeightContentRefreshKey =
    (fulfilled === true && itemCount < updatedPerPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (fulfilled === true && isLastPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (error === true && `bodyMinHeight-${updatedPerPage}-resize`) ||
    `bodyMinHeight-${updatedPerPage}`;

  return (
    <Card className="curiosity-inventory-card">
      <MinHeight key="headerMinHeight" updateOnContent>
        <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
          <CardHeaderMain>
            <ToolbarFieldDisplayName viewId={viewId} />
          </CardHeaderMain>
          <CardActions className={(!itemCount && 'transparent') || ''} aria-hidden={!itemCount || false}>
            <Pagination
              isCompact
              isDisabled={pending || error}
              itemCount={itemCount}
              offset={updatedOffset}
              onPage={this.onPage}
              onPerPage={this.onPage}
              perPage={updatedPerPage}
            />
          </CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key={minHeightContentRefreshKey} updateOnContent>
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && (
              <Loader
                variant="table"
                tableProps={{
                  className: 'curiosity-inventory-list',
                  colCount: filterInventoryData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
                  colWidth:
                    (filterInventoryData?.length && filterInventoryData.map(({ cellWidth }) => cellWidth)) || [],
                  rowCount: listData?.length || updatedPerPage,
                  variant: TableVariant.compact
                }}
              />
            )}
            {!pending && this.renderTable()}
          </div>
        </CardBody>
      </MinHeight>
      <MinHeight key="footerMinHeight" updateOnContent>
        <CardFooter
          className={(error && 'hidden') || (!itemCount && 'transparent') || ''}
          aria-hidden={error || !itemCount || false}
        >
          <TableToolbar isFooter>
            <Pagination
              dropDirection="up"
              isDisabled={pending || error}
              itemCount={itemCount}
              offset={updatedOffset}
              onPage={this.onPage}
              onPerPage={this.onPage}
              perPage={updatedPerPage}
            />
          </TableToolbar>
        </CardFooter>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{}}
 */
InventoryList.propTypes = {
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useInventorySelector: PropTypes.func,
  useProduct: PropTypes.func,
  useProductInventoryInstancesQuery: PropTypes.func,
  useProductInventoryInstancesConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{}}
 */
InventoryList.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_HOSTS,
  t: translate,
  useInventorySelector,
  useProduct,
  useProductInventoryInstancesConfig,
  useProductInventoryInstancesQuery
};

export { InventoryList as default, InventoryList };
