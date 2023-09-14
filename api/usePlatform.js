import { useEffect, useMemo } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
// import { useShallowCompareEffect } from 'react-use';
// import { featureFlags } from '../../config';

/**
 * Global platform related hooks.
 *
 * @memberof Hooks
 * @module usePlatform
 */

/**
 * @apiMock {DelayResponse} 1000
 * @api {get} /api/featureflags/v0
 * @apiDescription Mock unleash feature flag response.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "toggles": [
 *         {
 *             "name": "swatch.maintenance",
 *             "enabled": true,
 *             "variant": {
 *                 "name": "disabled",
 *                 "enabled": true
 *             },
 *             "name": "dolor.sit",
 *             "enabled": false,
 *             "variant": {
 *                 "name": "disabled",
 *                 "enabled": false
 *             }
 *         }
 *       ]
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": []
 *     }
 */
/**
 * Apply a resize observer to an element.
 *
 * @param {string|Array|object} flag
 * @returns {boolean}
 */
const useFeatureFlag = flag => {
  // const woot = useFlag(flag);
  // const test = useFlag(flag);
  // const [updatedFlag, setUpdatedFlag] = useState(false);
  const client = useUnleashClient(); // have to confirm their context updates when flags are updated... hard to test context updates with mocks
  // console.log('>>> client', woot);

  useEffect(() => {
    const testing = client.isEnabled('dolor.sit');
    console.log(testing);
  }, [client]);

  return useMemo(() => {
    if (typeof flag === 'string') {
      return client.isEnabled(flag);
    }
    if (Array.isArray(flag)) {
      return flag.map(value => ({ flag: value, isEnabled: client.isEnabled(value) }));
    }
    if (Object.keys(flag).length) {
      const updatedFlag = { ...flag };
      Object.keys(flag).forEach(value => {
        updatedFlag[value] = client.isEnabled(value);
      });
      return updatedFlag;
    }
  }, [client, flag]);
  /*
  useShallowCompareEffect(() => {
    const result = client.isEnabled(flag);
    console.log('>>>> test', result);
    setUpdatedFlag(result);
  }, [flag]);
  */

  /*
  if (flag) {
    const test = client.isEnabled(flag);
    // const otherTest = client.isEnabled(flag);
    console.log('>>>> test', test);
    return test;
  }
  */

  // return updatedFlag;
};

// const useFeatureFlags = ({ useDispatch: useAliasDispatch = useDispatch, useFlagClient: useAliasFlagClient = useUnleashClient } = {}) => {
// const dispatch = useDispatch();
// }

const platformHooks = {
  useChrome,
  useFeatureFlag
};

export { platformHooks as default, platformHooks, useChrome, useFeatureFlag };
