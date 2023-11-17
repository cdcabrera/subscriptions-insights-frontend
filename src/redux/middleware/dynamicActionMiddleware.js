/**
 * @memberof Middleware
 * @module MultiActionMiddleware
 */

/**
 * Allow passing an array of actions for batch dispatch.
 *
 * @param {object} store
 * @returns {Function}
 */
// you can skip this and just do a reducer
const dynamicActionMiddleware = store => next => action => {
  // console.log('>>> ACTION MIDDLEWARE', action, store.getState());

  console.log('>>> ACTION MIDDLEWARE', action);
  const result = next(action);
  console.log('>>> ACTION MIDDLEWARE NEXT STATE', result, store.getState());
  return result;

  /*
  switch (action.action) {
    case 'RESPONSE':
      return next({ ...action, type: 'WHATEVER_RESPONSE' });
    case 'DYNAMIC':
      return next({ ...action, type: 'WHATEVER' });
    default:
      return next(action);
  }
  */

  /*
   *if (action.action === 'DYNAMIC') {
   *  console.log('>>>>>', store, action);
   *  return next({ ...action, type: 'WHATEVER' });
   *}
   */
};

export { dynamicActionMiddleware as default, dynamicActionMiddleware };
