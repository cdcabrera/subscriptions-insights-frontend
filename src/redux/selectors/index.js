import graphCardSelectors from './graphCardSelectors';
import inventoryListSelectors from './inventoryListSelectors';
import userSelectors from './userSelectors';
import viewSelectors from './viewSelectors';

const reduxSelectors = {
  graphCard: graphCardSelectors,
  inventoryList: inventoryListSelectors,
  user: userSelectors,
  view: viewSelectors
};

export { reduxSelectors as default, reduxSelectors };
