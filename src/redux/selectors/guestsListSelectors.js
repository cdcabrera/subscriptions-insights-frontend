import { createSelector } from 'reselect';
import { selector as userSession } from './userSelectors';

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.hostsGuests?.[props.id]
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{listData: Array, pending: boolean, fulfilled: boolean, error: boolean, status: (*|number)}}
 */
const selector = createSelector([statePropsFilter], response => {
  const { metaId, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    listData: [],
    status: responseData.status
  };

  if (responseData.fulfilled) {
    const { data = [] } = responseData.data || {};

    updatedResponseData.fulfilled = true;
    updatedResponseData.listData.push(...data);
  }

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{listData: Array, pending: boolean, fulfilled: boolean, error: boolean, session: object,
 *     status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...userSession(state, props, defaultProps),
  ...selector(state, props, defaultProps)
});

const guestsListSelectors = {
  guestsList: selector,
  makeGuestsList: makeSelector
};

export { guestsListSelectors as default, guestsListSelectors, selector, makeSelector };
