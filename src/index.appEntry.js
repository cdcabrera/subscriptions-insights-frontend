import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FlagProvider } from '@unleash/proxy-client-react';
import { routerHelpers } from './components/router';
import { store } from './redux';
import App from './app';
import './styles/index.scss';
import '@patternfly/react-styles/css/components/Select/select.css';

const AppEntry = () => (
  <FlagProvider
    config={{
      url: process.env.REACT_APP_SERVICES_UNLEASH_FEATURE_FLAGS,
      clientKey: 'proxy-123',
      appName: 'web',
      headerName: 'X-Unleash-Auth',
      // refreshInterval: 60000,
      metricsInterval: 120000
    }}
  >
    <Provider store={store}>
      <BrowserRouter basename={routerHelpers.dynamicBaseName()}>
        <App />
      </BrowserRouter>
    </Provider>
  </FlagProvider>
);

export { AppEntry as default, AppEntry };
