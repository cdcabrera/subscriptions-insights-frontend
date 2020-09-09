import guestsListSelectors from './guestsListSelectors';
import graphCardSelectors from './graphCardSelectors';
import inventoryListSelectors from './inventoryListSelectors';
import pagingSelectors from './pagingSelectors';
import userSelectors from './userSelectors';
import viewSelectors from './viewSelectors';

const reduxSelectors = {
  guestsList: guestsListSelectors,
  graphCard: graphCardSelectors,
  inventoryList: inventoryListSelectors,
  paging: pagingSelectors,
  user: userSelectors,
  view: viewSelectors
};

export { reduxSelectors as default, reduxSelectors };
