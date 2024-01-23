import appReducer from '../appReducer';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';
import { appTypes as types } from '../../types';
import { reduxHelpers } from '../../common';

describe('UserReducer', () => {
  it('should return the initial state', () => {
    expect(appReducer.initialState).toBeDefined();
  });

  it('should handle specific http status types', () => {
    const specificTypes = [
      { type: types.STATUS_4XX, status: 400 },
      { type: types.STATUS_4XX, status: 401 },
      { type: types.STATUS_4XX, status: 403 }
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.HTTP_STATUS_RANGE(value.type),
        error: true,
        payload: {
          message: `Request failed with status code ${value.status}`,
          response: {
            status: value.status,
            statusText: 'Error',
            data: {
              [rhsmConstants.RHSM_API_RESPONSE_ERRORS]: [
                {
                  [rhsmConstants.RHSM_API_RESPONSE_ERRORS_TYPES.CODE]:
                    rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN
                }
              ]
            }
          }
        }
      };

      const resultState = appReducer(undefined, dispatched);

      expect({ type: value.type, result: resultState }).toMatchSnapshot(`http status ${value.type} ${value.status}`);
    });
  });
});
