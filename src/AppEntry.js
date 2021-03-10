import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { baseName } from './components/router/routerHelpers';
import { store } from './redux';
import App from './components/app';
import './styles/index.scss';

const AppEntry = () => (
  <Provider store={store}>
    what is happening
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </Provider>
);

AppEntry.propTypes = {};

export { AppEntry as default, AppEntry };
