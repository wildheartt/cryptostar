import React from 'react';

import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import App from './App';
import store from './app/store';
import 'antd/dist/reset.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
