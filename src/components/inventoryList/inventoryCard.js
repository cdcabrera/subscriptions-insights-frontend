import React from 'react';
import PropTypes from 'prop-types';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { MinHeight } from '../minHeight/minHeight';
import Pagination from '../pagination/pagination';
import { ToolbarFieldDisplayName } from '../toolbar/toolbarFieldDisplayName';
import { paginationHelpers } from '../pagination/paginationHelpers';
import { translate } from '../i18n/i18n';

/**
 * A hosts system inventory component.
 *
 * @fires onColumnSort
 * @fires onPage
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {boolean} props.error
 * @param {boolean} props.fulfilled
 * @param {number} props.itemCount
 * @param {boolean} props.pending
 * @param {Function} props.t
 * @returns {Node}
 */
const InventoryList = ({
  isDisabled,
  error,
  fulfilled,
  itemCount,
  pending,
  t,
  updatedOffset,
  updatedPerPage,
  onPage,
  children
}) => {
  if (isDisabled) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

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
            <ToolbarFieldDisplayName />
          </CardHeaderMain>
          <CardActions className={(!itemCount && 'transparent') || ''} aria-hidden={!itemCount || false}>
            <Pagination
              isCompact
              isDisabled={pending || error}
              itemCount={itemCount}
              offset={updatedOffset}
              onPage={onPage}
              onPerPage={onPage}
              perPage={updatedPerPage}
            />
          </CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key={minHeightContentRefreshKey} updateOnContent>
        <CardBody>
          <div className={(error && 'blur') || 'fadein'}>{children}</div>
        </CardBody>
      </MinHeight>
      <MinHeight key="footerMinHeight" updateOnContent>
        <CardFooter
          className={(error && 'hidden') || (!itemCount && 'transparent') || ''}
          aria-hidden={error || !itemCount || false}
        >
          <Pagination
            dropDirection="up"
            isDisabled={pending || error}
            itemCount={itemCount}
            offset={updatedOffset}
            onPage={onPage}
            onPerPage={onPage}
            perPage={updatedPerPage}
          />
        </CardFooter>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{t: Function, listData: Array, session: object, pending: boolean, fulfilled: boolean,
 *     getHostsInventory: Function, perPageDefault: number, isDisabled: boolean, error: boolean,
 *     itemCount: number}}
 */
InventoryList.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  pending: PropTypes.bool,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: Function, listData: Array, session: object, pending: boolean, fulfilled: boolean,
 *     getHostsInventory: Function, perPageDefault: number, isDisabled: boolean, error: boolean,
 *     itemCount: number}}
 */
InventoryList.defaultProps = {
  error: false,
  fulfilled: false,
  isDisabled: false,
  itemCount: 0,
  pending: false,
  t: translate
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.inventoryList.makeInventoryList();

const ConnectedInventoryList = connect(makeMapStateToProps, mapDispatchToProps)(InventoryList);

export { ConnectedInventoryList as default, ConnectedInventoryList, InventoryList };
