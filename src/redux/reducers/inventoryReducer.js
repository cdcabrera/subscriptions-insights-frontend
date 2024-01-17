import { rhsmTypes } from '../types/rhsmTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { inventoryTypes } from '../types';

/**
 * Inventory, and tabs, related API and user state reducer.
 *
 * @memberof Reducers
 * @module InventoryReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{subscriptionsInventory: {}, instancesGuests: {}, instancesInventory: {}, tabs: {}}}
 */
const initialState = {
  instancesGuests: {}
};

/**
 * Apply generated inventory observer/reducer for system and subscriptions inventory to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case inventoryTypes.CLEAR_INVENTORY_GUESTS:
      return reduxHelpers.setStateProp(
        'instancesGuests',
        {
          [action.id]: {}
        },
        {
          state,
          reset: false
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'instancesGuests', type: rhsmTypes.GET_INSTANCES_INVENTORY_GUESTS_RHSM }
        ],
        state,
        action
      );
  }
};

inventoryReducer.initialState = initialState;

export { inventoryReducer as default, initialState, inventoryReducer };
