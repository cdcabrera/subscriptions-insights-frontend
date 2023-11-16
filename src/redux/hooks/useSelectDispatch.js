import _isPlainObject from 'lodash/isPlainObject';
import { useDispatch, useSelectors, useSelectorsResponse } from './useReactRedux';
import { helpers } from '../../common/helpers';

const useAction = (
  actionType,
  {
    useDispatch: useAliasDispatch = useDispatch,
    useSelectors: useAliasSelectors = useSelectors
    // type = 'FLAT_FIELD'
  } = {}
) => {
  const updatedActionType = (Array.isArray(actionType) && actionType) || [actionType];
  const dispatch = useAliasDispatch();
  const select = useAliasSelectors([...updatedActionType.map(t => state => state?.flat?.[t])]);

  return {
    select: () => select,
    dispatch: () => value => {
      const updatedValue = (Array.isArray(value) && value) || [value];
      const multi = updatedValue.map(v => {
        console.log('>>>> DIS', v, _isPlainObject(v));

        if (helpers.isPromise(v)) {
          return {
            payload: v,
            type: actionType,
            meta: {
              _internal: true,
              stateKey: actionType
            }
          };
        }

        if (_isPlainObject(v)) {
          return {
            ...v,
            _internal: true,
            stateKey: actionType,
            type: actionType
          };
        }

        return v;
      });

      console.log('>>>> DIS MULTI', multi);

      dispatch(multi);

      // dispatch({ type: actionType, value })
    }
    /*
     * dispatch: () => value => dispatch({ type: actionType, value })
     * dispatch: () => value => dispatch(value)
     */
  };
};

const useActionResponse = (
  actionType,
  { useAction: useAliasAction = useAction, useSelectorsResponse: useAliasSelectorsResponse = useSelectorsResponse } = {}
) => useAliasAction(actionType, { useSelectors: useAliasSelectorsResponse, type: 'FLAT_RESPONSE' });

export { useAction, useActionResponse };
