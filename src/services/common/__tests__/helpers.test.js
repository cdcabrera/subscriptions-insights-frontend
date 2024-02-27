import { pollingRetryLimit, serviceHelpers } from '../helpers';

describe('Service Helpers', () => {
  it('should have specific functions', () => {
    expect(serviceHelpers).toMatchSnapshot('serviceHelpers');
  });

  it('should support cancelling function calls', async () => {
    const mockTimeout = async (successMessage, errorMessage, pause, timeout) => {
      const testFn = async () => {
        await new Promise(resolve => {
          window.setTimeout(resolve, pause);
        });

        return successMessage;
      };

      let value;

      try {
        value = await serviceHelpers.timeoutFunctionCancel(testFn, { timeout, errorMessage });
      } catch (e) {
        value = e.message;
      }

      return value;
    };

    const success = await mockTimeout('lorem ipsum success', 'dolor sit error', 50, 100);
    const error = await mockTimeout('lorem ipsum success', 'dolor sit error', 100, 50);

    expect({ success, error }).toMatchSnapshot('timeout error');
  });

  it('should support camel casing obj keys', () => {
    expect(
      serviceHelpers.camelCase({
        lorem_ipsum: [
          {
            dolor_sit: [
              {
                hello_world: 1
              }
            ]
          }
        ]
      })
    ).toMatchSnapshot('camelCase');
  });

  it('should support applying data to a supplied callback', () => {
    const mockSchema = jest.fn();

    serviceHelpers.passDataToCallback(mockSchema, { hello: 'world' }, 'lorem ipsum');

    expect(mockSchema.mock.calls).toMatchSnapshot('passDataToCallback, success');

    mockSchema.mockClear();

    expect(
      serviceHelpers.passDataToCallback(
        () => {
          throw new Error('hello world');
        },
        { dolor: 'sit' }
      )
    ).toMatchSnapshot('passDataToCallback, error');
  });

  it('should support a polling retry limit calculation', () => {
    expect(pollingRetryLimit.memoize).toBeDefined();

    expect({
      exact: pollingRetryLimit(100, 100, 1),
      limitLessThanInterval: pollingRetryLimit(10, 100, 1),
      limitGreaterThanInterval: pollingRetryLimit(100, 10, 1),
      limitUndefined: pollingRetryLimit(undefined, 100, 1),
      intervalUndefined: pollingRetryLimit(100, undefined, 1)
    }).toMatchSnapshot('retry limits');

    expect({
      exact: pollingRetryLimit(100, 100, 0),
      limitLessThanInterval: pollingRetryLimit(10, 100, 0),
      limitGreaterThanInterval: pollingRetryLimit(100, 10, 0),
      limitUndefined: pollingRetryLimit(undefined, 100, 0),
      intervalUndefined: pollingRetryLimit(100, undefined, 0)
    }).toMatchSnapshot('retry limits, zero');
  });

  it('should attempt to apply a Joi schema to a response', () => {
    const mockValidate = jest.fn().mockImplementation(response => ({ value: response }));

    serviceHelpers.schemaResponse({
      schema: { validate: mockValidate },
      response: { lorem_ipsum: 'dolor_sit' }
    });
    expect(mockValidate.mock.calls).toMatchSnapshot('schemaResponse, parameters');

    expect(
      serviceHelpers.schemaResponse({
        schema: { validate: mockValidate },
        response: { lorem_ipsum: 'dolor_sit' },
        casing: 'camel'
      })
    ).toMatchSnapshot('schemaResponse, camelCasing');

    mockValidate.mockClear();
  });
});
