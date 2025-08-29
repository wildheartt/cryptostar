import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Homepage from '../Homepage';
import { cryptoApi } from '../../services/cryptoApi';

const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(cryptoApi.middleware)
});

jest.mock('../../services/cryptoApi', () => ({
  useGetCryptosQuery: jest.fn(),
  cryptoApi: {
    reducerPath: 'cryptoApi',
    reducer: (state = {}) => state,
    middleware: () => next => action => next(action)
  }
}));

const { useGetCryptosQuery } = require('../../services/cryptoApi');

const mockStats = {
  total: 100,
  total24hVolume: '1000000',
  totalMarketCap: '2000000000',
  totalMarkets: 500,
  totalExchanges: 50
};

const mockCoins = [
  {
    uuid: '1',
    rank: 1,
    name: 'Bitcoin',
    price: '50000',
    marketCap: '900000000',
    change: '2',
    iconUrl: 'https://bitcoin.org/img.png'
  },
  {
    uuid: '2',
    rank: 2,
    name: 'Ethereum',
    price: '3000',
    marketCap: '300000000',
    change: '3',
    iconUrl: 'https://ethereum.org/img.png'
  }
];

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    </Provider>
  );
};

describe('Homepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает состояние загрузки', () => {
    useGetCryptosQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: undefined
    });

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке', () => {
    const errorMessage = 'Failed to fetch data';
    useGetCryptosQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: { message: errorMessage }
    });

    renderComponent();

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('отображает глобальную крипто статистику', () => {
    useGetCryptosQuery.mockReturnValue({
      data: {
        data: {
          stats: mockStats,
          coins: mockCoins
        }
      },
      isFetching: false,
      error: undefined
    });

    renderComponent();

    expect(screen.getByText('Глобальная крипто статистика')).toBeInTheDocument();

    expect(screen.getByText(/Всего криптовалют/)).toBeInTheDocument();
    expect(screen.getByText(/Всего бирж/)).toBeInTheDocument();
    expect(screen.getByText(/Объём за 24ч/)).toBeInTheDocument();
    expect(screen.getByText(/Общая капитализация/)).toBeInTheDocument();
    expect(screen.getByText(/Всего рынков/)).toBeInTheDocument();
  });

  it('отображает топ-10 криптовалют', () => {
    useGetCryptosQuery.mockReturnValue({
      data: {
        data: {
          stats: mockStats,
          coins: mockCoins
        }
      },
      isFetching: false,
      error: undefined
    });

    renderComponent();

    expect(screen.getByText('Топ 10 криптовалют в мире')).toBeInTheDocument();

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();

    expect(screen.getByText('Показать больше')).toBeInTheDocument();
  });

  it('отображает правильные значения в статистике', () => {
    useGetCryptosQuery.mockReturnValue({
      data: {
        data: {
          stats: mockStats,
          coins: mockCoins
        }
      },
      isFetching: false,
      error: undefined
    });

    renderComponent();

    expect(screen.getByText('100')).toBeInTheDocument(); // total
    expect(screen.getByText('50')).toBeInTheDocument(); // totalExchanges
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('отображает корректные ссылки на криптовалюты', () => {
    useGetCryptosQuery.mockReturnValue({
      data: {
        data: {
          stats: mockStats,
          coins: mockCoins
        }
      },
      isFetching: false,
      error: undefined
    });

    renderComponent();

    const bitcoinLink = screen.getByText('Bitcoin').closest('a');
    const ethereumLink = screen.getByText('Ethereum').closest('a');

    expect(bitcoinLink).toHaveAttribute('href', '/crypto/1');
    expect(ethereumLink).toHaveAttribute('href', '/crypto/2');
  });
});
