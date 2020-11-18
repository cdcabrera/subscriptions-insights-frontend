import appMessagesSelectors from './appMessagesSelectors';
import dailyGraphCardSelectors from './dailyGraphCardSelectors';
import guestsListSelectors from './guestsListSelectors';
import graphCardSelectors from './graphCardSelectors';
import inventoryListSelectors from './inventoryListSelectors';
import userSelectors from './userSelectors';
import viewSelectors from './viewSelectors';

const reduxSelectors = {
  appMessages: appMessagesSelectors,
  dailyGraphCard: dailyGraphCardSelectors,
  guestsList: guestsListSelectors,
  graphCard: graphCardSelectors,
  inventoryList: inventoryListSelectors,
  user: userSelectors,
  view: viewSelectors
};

export { reduxSelectors as default, reduxSelectors };
