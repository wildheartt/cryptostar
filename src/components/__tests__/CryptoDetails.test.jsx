import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CryptoDetails from '../CryptoDetails';
import { cryptoApi } from '../../services/cryptoApi';

jest.mock('react-chartjs-2', () => ({
  Line: () => null
}));
jest.mock('html-react-parser', () => text => text);

jest.mock('../../services/cryptoApi', () => {
  const actual = jest.requireActual('../../services/cryptoApi');
  return {
    ...actual,
    useGetCryptoDetailsQuery: jest.fn(),
    useGetCryptoHistoryQuery: jest.fn(),
    cryptoApi: {
      ...actual.cryptoApi,
      reducerPath: 'cryptoApi',
      reducer: (state = {}) => state,
      middleware: () => next => action => next(action)
    }
  };
});

const { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } = require('../../services/cryptoApi');

const mockCoin = {
  data: {
    coin: {
      uuid: '1',
      name: 'TestCoin',
      symbol: 'TC',
      price: '1234',
      rank: 5,
      marketCap: '5000000',
      allTimeHigh: { price: '2000' },
      supply: { confirmed: true, total: '10000', circulating: '9000' },
      numberOfMarkets: 10,
      numberOfExchanges: 5,
      description: 'Описание TestCoin',
      links: [{ name: 'Website', type: 'website', url: 'https://test.com' }]
    }
  }
};

const mockHistory = {
  data: {
    change: '10',
    history: [
      { price: '1000', timestamp: 1234567890 },
      { price: '1200', timestamp: 1234567891 }
    ]
  }
};

const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(cryptoApi.middleware)
});

const renderComponent = async () => {
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/crypto/1']}>
        <Routes>
          <Route path="/crypto/:coinId" element={<CryptoDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  return result;
};

describe('CryptoDetails', () => {
  beforeEach(() => {
    useGetCryptoDetailsQuery.mockReturnValue({
      data: mockCoin,
      isFetching: false,
      error: null
    });
    useGetCryptoHistoryQuery.mockReturnValue({
      data: mockHistory.data,
      isFetching: false,
      error: null
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('отображает состояние загрузки', async () => {
    useGetCryptoDetailsQuery.mockReturnValue({
      data: null,
      isFetching: true,
      error: null
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crypto/1']}>
          <Routes>
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке', async () => {
    useGetCryptoDetailsQuery.mockReturnValue({
      data: null,
      isFetching: false,
      error: { message: 'Ошибка загрузки данных' }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crypto/1']}>
          <Routes>
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/ошибка загрузки данных/i)).toBeInTheDocument();
  });

  it('отображает сообщение об отсутствии данных', async () => {
    useGetCryptoDetailsQuery.mockReturnValue({
      data: { data: { coin: null } },
      isFetching: false,
      error: null
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/crypto/1']}>
          <Routes>
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('рендерит все ключевые блоки CryptoDetails', async () => {
    await renderComponent();

    expect(screen.getByText(/TestCoin \(TC\) стоимость/i)).toBeInTheDocument();

    const statsHeading = screen.getByText(/Статистика TestCoin/i);
    expect(statsHeading).toBeInTheDocument();

    const statsContainer = statsHeading.closest('.coin-value-statistics');
    expect(statsContainer).toBeInTheDocument();

    const statsNames = screen.getAllByRole('generic');
    expect(statsNames.some(el => el.textContent.includes('Цена в долларах США'))).toBeTruthy();
    expect(statsNames.some(el => el.textContent.includes('Ранг'))).toBeTruthy();
    expect(statsNames.some(el => el.textContent.includes('Рыночная капитализация'))).toBeTruthy();
    expect(statsNames.some(el => el.textContent.includes('Абсолютный максимум'))).toBeTruthy();

    expect(screen.getByText(/Что такое TestCoin\?/i)).toBeInTheDocument();
    expect(screen.getByText('Описание TestCoin')).toBeInTheDocument();

    expect(screen.getByText(/Полезные ссылки по TestCoin/i)).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('обновляет данные при изменении периода времени', async () => {
    await renderComponent();

    const select = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.change(select, { target: { value: '24h' } });
    });

    await waitFor(() => {
      expect(useGetCryptoHistoryQuery).toHaveBeenCalledWith({
        coinId: '1',
        timePeriod: '24h'
      });
    });
  });

  it('корректно отображает все статистические данные', async () => {
    await renderComponent();

    const statsHeading = screen.getByText(/Статистика TestCoin/i);
    const statsContainer = statsHeading.closest('.coin-value-statistics');
    expect(statsContainer).toBeInTheDocument();

    const statsElements = screen.getAllByRole('generic');
    expect(statsElements.some(el => el.textContent.includes('Цена в долларах США'))).toBeTruthy();
    expect(statsElements.some(el => el.textContent.includes('Ранг'))).toBeTruthy();
    expect(
      statsElements.some(el => el.textContent.includes('Рыночная капитализация'))
    ).toBeTruthy();
    expect(statsElements.some(el => el.textContent.includes('Абсолютный максимум'))).toBeTruthy();

    const otherStatsHeading = screen.getByText(/Дополнительные данные/i);
    const otherStatsContainer = otherStatsHeading.closest('.other-stats-info');
    expect(otherStatsContainer).toBeInTheDocument();

    expect(statsElements.some(el => el.textContent.includes('Количество рынков'))).toBeTruthy();
    expect(statsElements.some(el => el.textContent.includes('Количество бирж'))).toBeTruthy();
    expect(
      statsElements.some(el => el.textContent.includes('Подтверждённое предложение'))
    ).toBeTruthy();
    expect(statsElements.some(el => el.textContent.includes('Общее предложение'))).toBeTruthy();
    expect(
      statsElements.some(el => el.textContent.includes('Циркулирующее предложение'))
    ).toBeTruthy();
  });
});
