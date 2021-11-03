import graphSelectors from '../graphSelectors';
import {
  RHSM_API_RESPONSE_TALLY_META_TYPES as TALLY_META_TYPES,
  rhsmConstants
} from '../../../services/rhsm/rhsmConstants';

describe('GraphSelectors', () => {
  it('should return specific selectors', () => {
    expect(graphSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(graphSelectors.graph(state)).toMatchSnapshot('missing reducer error');
  });

  it('should handle an error state', () => {
    const data = {
      productId: 'Lorem Ipsum',
      metrics: ['Dolor Sit', 'Et all']
    };
    const props = {};
    const state = {
      graph: {
        tally: {
          'Lorem Ipsum_Dolor Sit': {
            error: true,
            errorMessage: `I'm a teapot`,
            fulfilled: false,
            pending: false,
            status: 418,
            meta: {},
            metaId: 'Lorem Ipsum_Dolor Sit',
            metaIdMetric: { id: 'Lorem Ipsum', metric: 'Dolor Sit' },
            metaQuery: {}
          },
          'Lorem Ipsum_Et all': {
            error: true,
            errorMessage: `I'm a teapot`,
            fulfilled: false,
            pending: false,
            status: 418,
            meta: {},
            metaId: 'Lorem Ipsum_Et all',
            metaIdMetric: { id: 'Lorem Ipsum', metric: 'Et all' },
            metaQuery: {}
          }
        }
      }
    };

    expect(graphSelectors.graph(state, props, data)).toMatchSnapshot('error state');
  });

  it('should handle a cancelled state', () => {
    const data = {
      productId: 'Lorem Ipsum',
      metrics: ['Dolor Sit']
    };
    const props = {};
    const state = {
      graph: {
        tally: {
          'Lorem Ipsum_Dolor Sit': {
            date: 'mock date',
            cancelled: true,
            error: false,
            errorMessage: '',
            fulfilled: false,
            pending: false,
            meta: {},
            metaId: 'Lorem Ipsum_Dolor Sit',
            metaIdMetric: { id: 'Lorem Ipsum', metric: 'Dolor Sit' },
            metaQuery: {}
          }
        }
      }
    };

    expect(graphSelectors.graph(state, props, data)).toMatchSnapshot('cancelled state');
  });

  it('should handle a pending state', () => {
    const data = {
      productId: 'Lorem Ipsum',
      metrics: ['Dolor Sit']
    };
    const props = {};
    const state = {
      graph: {
        tally: {
          'Lorem Ipsum_Dolor Sit': {
            error: false,
            errorMessage: '',
            fulfilled: false,
            pending: true,
            meta: {},
            metaId: 'Lorem Ipsum_Dolor Sit',
            metaIdMetric: { id: 'Lorem Ipsum', metric: 'Dolor Sit' },
            metaQuery: {}
          }
        }
      }
    };

    expect(graphSelectors.graph(state, props, data)).toMatchSnapshot('pending state');
  });

  it('should handle a fulfilled state', () => {
    const data = {
      productId: 'Lorem Ipsum',
      metrics: ['Dolor Sit']
    };
    const props = {};
    const state = {
      graph: {
        tally: {
          'Lorem Ipsum_Dolor Sit': {
            error: false,
            errorMessage: '',
            fulfilled: true,
            pending: false,
            meta: {},
            metaId: 'Lorem Ipsum_Dolor Sit',
            metaIdMetric: { id: 'Lorem Ipsum', metric: 'Dolor Sit' },
            metaQuery: {},
            date: '2019-09-05T00:00:00.000Z',
            data: {
              [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
                {
                  [rhsmConstants.RHSM_API_RESPONSE_TALLY_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                  [rhsmConstants.RHSM_API_RESPONSE_TALLY_DATA_TYPES.VALUE]: 10,
                  [rhsmConstants.RHSM_API_RESPONSE_TALLY_DATA_TYPES.HAS_DATA]: true
                },
                {
                  [rhsmConstants.RHSM_API_RESPONSE_TALLY_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                  [rhsmConstants.RHSM_API_RESPONSE_TALLY_DATA_TYPES.VALUE]: 15,
                  [rhsmConstants.RHSM_API_RESPONSE_TALLY_DATA_TYPES.HAS_DATA]: false
                }
              ],
              [rhsmConstants.RHSM_API_RESPONSE_META]: {
                [TALLY_META_TYPES.COUNT]: 2,
                [TALLY_META_TYPES.METRIC_ID]: 'Dolor Sit',
                [TALLY_META_TYPES.PRODUCT]: 'Lorem Ipsum',
                [TALLY_META_TYPES.TOTAL_MONTHLY]: {
                  [TALLY_META_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                  [TALLY_META_TYPES.HAS_DATA]: true,
                  [TALLY_META_TYPES.VALUE]: 25
                }
              }
            },
            status: 304
          }
        }
      }
    };

    expect(graphSelectors.graph(state, props, data)).toMatchSnapshot('fulfilled state');
  });
});
