/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMount, useUnmount, useShallowCompareEffect } from 'react-use';
import { TableVariant } from '@patternfly/react-table';
import { useSession } from '../authentication/authenticationContext';
import { useProductInventoryGuestsConfig, useProductInventoryGuestsQuery } from '../productView/productViewContext';
import { Loader } from '../loader/loader';
import { inventoryCardHelpers } from '../inventoryCard/inventoryCardHelpers';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { Table } from '../table/table';
import { useGetGuestsInventory, useOnScroll, useGuestsInventory, useSelectorsGuestsInventory } from './inventoryGuestsContext';

/**
 * A system inventory guests component.
 *
 * @param {object} props
 * @param {number} props.defaultPerPage
 * @param {string} props.id
 * @param {number} props.numberOfGuests
 * @param {Function} props.useGetGuestsInventory
 * @param {Function} props.useOnScroll
 * @param {Function} props.useProductInventoryGuestsQuery
 * @param {Function} props.useProductInventoryGuestsConfig
 * @param {Function} props.useSession
 * @fires onScroll
 * @returns {Node}
 */
const InventoryGuests = ({
  defaultPerPage,
  id,
  numberOfGuests,
  useDispatch: useAliasDispatch,
  useGetGuestsInventory: useAliasGetGuestsInventory,
  useOnScroll: useAliasOnScroll,
  useProductInventoryGuestsQuery: useAliasProductInventoryGuestsQuery,
  useProductInventoryGuestsConfig: useAliasProductInventoryGuestsConfig,
  useSession: useAliasSession
}) => {
  // const [previousData, setPreviousData] = useState([]);
  const sessionData = useAliasSession();
  const { filters: filterGuestsData } = useAliasProductInventoryGuestsConfig();

  const query = useAliasProductInventoryGuestsQuery({ options: { overrideId: id } });
  const { [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage } = query;

  // useGetGuestsInventory(id);
  //  const { error, pending, data = {} } = useSelectorsGuestsInventory(id);
  // const { error, pending, data = {} } = useAliasGetGuestsInventory(id);
  const { error, fulfilled, pending, data = [] } = useGuestsInventory(id);

  let updatedRowCount = 0;

  if (currentPage === 0) {
    updatedRowCount = numberOfGuests < defaultPerPage ? numberOfGuests : defaultPerPage;
  }

  /*
  return <div>
    work work work<br/>error={error.toString()}<br/>fulfilled={fulfilled.toString()}<br/>pending={pending.toString()}
  </div>;
   */

  return (
    <div key={`guests-item-${id}`}>
      {!data.length && (
        <Loader
          variant="table"
          tableProps={{
            borders: false,
            className: 'curiosity-guests-list',
            colCount: filterGuestsData?.length || (data?.[0] && Object.keys(data[0]).length) || 1,
            colWidth: (filterGuestsData?.length && filterGuestsData.map(({ cellWidth }) => cellWidth)) || [],
            rowCount: updatedRowCount,
            variant: TableVariant.compact
          }}
        />
      ) || <React.Fragment>work</React.Fragment>}
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductInventoryGuestsConfig: Function, useSession: Function, numberOfGuests: number, id: string,
 *     useOnScroll: Function, useGetGuestsInventory: Function, useProductInventoryGuestsQuery: Function,
 *     defaultPerPage: number}}
 */
InventoryGuests.propTypes = {
  defaultPerPage: PropTypes.number,
  id: PropTypes.string.isRequired,
  numberOfGuests: PropTypes.number.isRequired,
  useGetGuestsInventory: PropTypes.func,
  useOnScroll: PropTypes.func,
  useProductInventoryGuestsConfig: PropTypes.func,
  useProductInventoryGuestsQuery: PropTypes.func,
  useSession: PropTypes.func,
  useDispatch: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductInventoryGuestsConfig: Function, useSession: Function, useOnScroll: Function,
 *     useGetGuestsInventory: Function, useProductInventoryGuestsQuery: Function, defaultPerPage: number}}
 */
InventoryGuests.defaultProps = {
  defaultPerPage: 5,
  useGetGuestsInventory,
  useOnScroll,
  useProductInventoryGuestsConfig,
  useProductInventoryGuestsQuery,
  useSession,
  useDispatch: storeHooks.reactRedux.useDispatch
};

export { InventoryGuests as default, InventoryGuests };
