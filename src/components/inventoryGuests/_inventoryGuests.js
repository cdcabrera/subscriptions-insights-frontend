/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../loader/loader';
import { Table, TableVariant } from '../table/_table';
import { useGetGuestsInventory, useOnScroll } from './_inventoryGuestsContext';

/**
 * Guests inventory table wrapper.
 *
 * @memberof Components
 * @module InventoryGuests
 * @property {module} InventoryGuestsContext
 */

/**
 * A system inventory guests component.
 *
 * @param {object} props
 * @param {number} props.defaultPerPage
 * @param {string} props.id
 * @param {number} props.numberOfGuests
 * @param {Function} props.useGetGuestsInventory
 * @param {Function} props.useOnScroll
 * @fires onScroll
 * @returns {React.ReactNode}
 */
const InventoryGuests = ({
  defaultPerPage,
  id,
  numberOfGuests,
  useGetGuestsInventory: useAliasGetGuestsInventory,
  useOnScroll: useAliasOnScroll
}) => {
  const {
    pending,
    dataSetColumnHeaders = [],
    dataSetRows = [],
    resultsColumnCountAndWidths = { count: 1, widths: [] },
    // resultsCount,
    resultsOffset
    // resultsPerPage
  } = useAliasGetGuestsInventory({ id, numberOfGuests });

  // return 'hello world';

  const onScroll = useAliasOnScroll({ id, numberOfGuests });

  // ToDo: Review having the height be a calc value
  // Include the table header
  let updatedHeight = (numberOfGuests + 1) * 42;
  updatedHeight = (updatedHeight < 275 && updatedHeight) || 275;

  return (
    <div className="fadein">
      <div className="curiosity-table-scroll" style={{ height: `${updatedHeight}px` }}>
        <div
          className={`curiosity-table-scroll-list${(updatedHeight < 275 && '__no-scroll') || ''}`}
          onScroll={onScroll}
        >
          {pending && (
            <div className="curiosity-table-scroll-loader__custom">
              <Loader
                variant="table"
                tableProps={{
                  borders: false,
                  className: (resultsOffset === 0 && 'curiosity-guests-list') || undefined,
                  colCount: resultsColumnCountAndWidths.count,
                  colWidth: resultsColumnCountAndWidths.widths,
                  // rowCount: dataSetRows?.length || resultsPerPage,
                  // colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
                  // colWidth: (filterGuestsData?.length && filterGuestsData.map(({ cellWidth }) => cellWidth)) || [],
                  rowCount:
                    (resultsOffset === 0 && numberOfGuests < defaultPerPage && numberOfGuests) || defaultPerPage,
                  variant: TableVariant.compact
                }}
              />
            </div>
          )}
          {(dataSetRows?.length && (
            <Table
              isBorders={false}
              isHeader
              className="curiosity-guests-list"
              columnHeaders={dataSetColumnHeaders}
              rows={dataSetRows}
            />
          )) ||
            null}
        </div>
      </div>
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
  useOnScroll: PropTypes.func
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
  useOnScroll
};

export { InventoryGuests as default, InventoryGuests };
