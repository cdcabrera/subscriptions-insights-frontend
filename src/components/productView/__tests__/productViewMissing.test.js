import React from 'react';
import { Provider } from 'react-redux';
import { ProductViewMissing } from '../productViewMissing';
import { store } from '../../../redux';

describe('ProductViewMissing Component', () => {
  it('should render a basic component', async () => {
    const props = {
      availableProductsRedirect: 1
    };

    const component = await mountHookComponent(
      <Provider store={store}>
        <ProductViewMissing {...props} />
      </Provider>
    );

    expect(component.find(ProductViewMissing)).toMatchSnapshot('basic');
  });

  it('should redirect when there are limited product cards', async () => {
    const mockPush = jest.fn();
    const props = {
      availableProductsRedirect: 200,
      useNavigate: () => mockPush,
      useRouteDetail: () => ({ firstMatch: { productPath: 'lorem-ipsum' } })
    };

    await mountHookComponent(<ProductViewMissing {...props} />);
    expect(mockPush.mock.calls).toMatchSnapshot('redirect action');
  });
});
