import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { exchangeApi, useGetExchangesQuery } from '../exchangeApi';

const mockExchanges = [
  {
    id: 'binance',
    name: 'Binance',
    year_established: 2017,
    country: 'Cayman Islands',
    description: '',
    url: 'https://www.binance.com',
    image: 'https://assets.coingecko.com/markets/images/52/small/binance.jpg',
    trust_score: 10,
    trust_score_rank: 1,
    trade_volume_24h_btc: 100000
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    year_established: 2012,
    country: 'United States',
    description: '',
    url: 'https://www.coinbase.com',
    image: 'https://assets.coingecko.com/markets/images/23/small/coinbase.jpg',
    trust_score: 10,
    trust_score_rank: 2,
    trade_volume_24h_btc: 50000
  }
];

// Создаем мок сервер
const server = setupServer(
  rest.get('https://api.coingecko.com/api/v3/exchanges', (req, res, ctx) => {
    return res(ctx.json(mockExchanges));
  })
);

// Создаем тестовый store
const createTestStore = () =>
  configureStore({
    reducer: {
      [exchangeApi.reducerPath]: exchangeApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(exchangeApi.middleware)
  });

describe('exchangeApi', () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('успешно получает список бирж', async () => {
    const store = createTestStore();
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

    const { result } = renderHook(() => useGetExchangesQuery(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockExchanges);
    expect(result.current.data[0].name).toBe('Binance');
    expect(result.current.data[1].name).toBe('Coinbase');
  });

  it('обрабатывает ошибку при неудачном запросе', async () => {
    server.use(
      rest.get('https://api.coingecko.com/api/v3/exchanges', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const store = createTestStore();
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

    const { result } = renderHook(() => useGetExchangesQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('кэширует данные после первого запроса', async () => {
    const store = createTestStore();
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

    const { result: firstResult } = renderHook(() => useGetExchangesQuery(), {
      wrapper
    });

    await waitFor(() => {
      expect(firstResult.current.isSuccess).toBe(true);
    });

    const { result: secondResult } = renderHook(() => useGetExchangesQuery(), {
      wrapper
    });

    expect(secondResult.current.isLoading).toBe(false);
    expect(secondResult.current.data).toEqual(mockExchanges);
  });

  it('имеет правильную конфигурацию API', () => {
    expect(exchangeApi.reducerPath).toBe('exchangeApi');
    expect(exchangeApi.endpoints.getExchanges).toBeDefined();
    expect(typeof exchangeApi.endpoints.getExchanges.query).toBe('function');
  });
});
