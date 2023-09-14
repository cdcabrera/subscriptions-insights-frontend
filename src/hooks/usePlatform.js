import { useState } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient, useUnleashContext } from '@unleash/proxy-client-react';
import { useShallowCompareEffect } from 'react-use';
// import { useInterval, useMount } from 'react-use';
// import { useTimeout } from './useTimeout';
// import { helpers } from '../common/helpers';
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
 *             "enabled": true,
 *             "variant": {
 *                 "name": "disabled",
 *                 "enabled": true
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
 * @param {*} context
 * @returns {boolean}
 */
const useFeatureFlag = (flag, context = 'hello-world') => {
  const [a, b] = useState();
  const client = useUnleashClient();
  const updateContext = useUnleashContext();

  useShallowCompareEffect(() => {
    const temp = () => {
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
    };

    const run = async () => {
      // Can wait for the new flags to pull in from the different context
      await updateContext({ context });
      b(() => temp());
      console.log('new flags loaded for', context);
    };

    run();
  }, [client, flag, updateContext, context]);

  return a;

  /*
  const [result, setResult] = useState();
  // const woot = useFlag(flag);
  // const test = useFlag(flag);
  // const [updatedFlag, setUpdatedFlag] = useState(false);
  const client = useUnleashClient(); // have to confirm their context updates when flags are updated... hard to test context updates with mocks
  // console.log('>>> client', woot);
  // const { flagsReady } = useFlagsStatus();s

  // const { update } = useTimeout(() => true, 10);
  // console.log('>>>', update);
  const temp = () => {
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
  };

  useMount(() => {
    if (!result) {
      setResult(() => temp());
    }
  });

  useInterval(() => {
    setResult(() => temp());
  }, 20000);

  return useMemo(() => result, [result]);
  */

  /*
  const { update } = useTimeout(() => true, 10);

  const result = helpers.memo((f, u) => {
    console.log('>>> u', u);
    if (typeof f === 'string') {
      return client.isEnabled(f);
    }
    if (Array.isArray(f)) {
      return f.map(value => ({ flag: value, isEnabled: client.isEnabled(value) }));
    }
    if (Object.keys(f).length) {
      const updatedFlag = { ...f };
      Object.keys(f).forEach(value => {
        updatedFlag[value] = client.isEnabled(value);
      });
      return updatedFlag;
    }
  });
  */

  // return result(flag, update);

  // console.log('>>> LOADING', client, flag);

  /*
  useEffect(
    const testing = client.isEnabled('dolor.sit');
    console.log(testing);
    [flagsReady, client]
  );

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
  */
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
