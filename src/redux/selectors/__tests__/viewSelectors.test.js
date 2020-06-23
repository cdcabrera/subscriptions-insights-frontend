import viewSelectors from '../viewSelectors';

describe('ViewSelectors', () => {
  it('should return specific selectors', () => {
    expect(viewSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(viewSelectors.view(state)).toMatchSnapshot('missing reducer error');

    state.view = {};
    expect(viewSelectors.view(state)).toMatchSnapshot('missing reducer view properties error');

    state.view = {
      graphQuery: {}
    };
    expect(viewSelectors.view(state)).toMatchSnapshot('missing reducer view.graphQuery ID error');
  });
});
