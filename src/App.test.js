import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { cryptoApi } from './services/cryptoApi';
import { exchangeApi } from './services/exchangeApi';

const createTestStore = () =>
  configureStore({
    reducer: {
      [cryptoApi.reducerPath]: cryptoApi.reducer,
      [exchangeApi.reducerPath]: exchangeApi.reducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(cryptoApi.middleware, exchangeApi.middleware)
  });

jest.mock('./components', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Homepage: () => <div data-testid="homepage">Homepage</div>,
  Cryptocurrencies: () => <div data-testid="cryptocurrencies">Cryptocurrencies</div>,
  Exchanges: () => <div data-testid="exchanges">Exchanges</div>,
  CryptoDetails: () => <div data-testid="crypto-details">CryptoDetails</div>
}));

const renderApp = (initialRoute = '/') => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('App', () => {
  it('отображает Navbar на всех страницах', () => {
    renderApp();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('отображает Homepage на главной странице', () => {
    renderApp('/');
    expect(screen.getByTestId('homepage')).toBeInTheDocument();
  });

  it('отображает Cryptocurrencies на странице криптовалют', () => {
    renderApp('/cryptocurrencies');
    expect(screen.getByTestId('cryptocurrencies')).toBeInTheDocument();
  });

  it('отображает Exchanges на странице бирж', () => {
    renderApp('/exchanges');
    expect(screen.getByTestId('exchanges')).toBeInTheDocument();
  });

  it('отображает CryptoDetails на странице деталей криптовалюты', () => {
    renderApp('/crypto/bitcoin');
    expect(screen.getByTestId('crypto-details')).toBeInTheDocument();
  });

  it('имеет правильную структуру layout', () => {
    renderApp();

    expect(screen.getByClassName('app')).toBeInTheDocument();
    expect(screen.getByClassName('navbar')).toBeInTheDocument();
    expect(screen.getByClassName('main')).toBeInTheDocument();
    expect(screen.getByClassName('routes')).toBeInTheDocument();
    expect(screen.getByClassName('footer')).toBeInTheDocument();
  });

  it('применяет стили antd', () => {
    renderApp();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
