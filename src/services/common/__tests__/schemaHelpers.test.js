import { schemaHelpers } from '../schemaHelpers';

describe('Schema Helpers', () => {
  it('should have specific functions', () => {
    expect(schemaHelpers).toMatchSnapshot('schemaHelpers');
  });

  it('should support camel casing obj keys', () => {
    expect(
      schemaHelpers.camelCase({
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

  it('should attempt to apply a Joi schema to a response', () => {
    const mockValidate = jest.fn().mockImplementation(response => ({ value: response }));

    schemaHelpers.schemaResponse({
      schema: { validate: mockValidate },
      response: { lorem_ipsum: 'dolor_sit' }
    });
    expect(mockValidate.mock.calls).toMatchSnapshot('schemaResponse, parameters');

    expect(
      schemaHelpers.schemaResponse({
        schema: { validate: mockValidate },
        response: { lorem_ipsum: 'dolor_sit' },
        casing: 'camel'
      })
    ).toMatchSnapshot('schemaResponse, camelCasing');

    mockValidate.mockClear();
  });
});
