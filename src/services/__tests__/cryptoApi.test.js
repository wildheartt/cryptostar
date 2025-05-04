import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from '../cryptoApi';

process.env.REACT_APP_CRYPTO_RAPIDAPI_HOST = 'test-host';
process.env.REACT_APP_RAPIDAPI_KEY = 'test-key';

const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(cryptoApi.middleware)
});

jest.mock('@reduxjs/toolkit/query/react', () => ({
  ...jest.requireActual('@reduxjs/toolkit/query/react'),
  fetchBaseQuery: () => async args => {
    expect(args.headers).toEqual({
      'x-rapidapi-host': 'test-host',
      'x-rapidapi-key': 'test-key'
    });

    if (args.url.includes('/coins')) {
      return {
        data: {
          data: {
            coins: Array(5).fill({ uuid: '1' })
          }
        }
      };
    }
    if (args.url.includes('/coin/')) {
      if (args.url.includes('/history')) {
        return {
          data: {
            data: {
              history: [
                { price: '100', timestamp: 1625097600 },
                { price: '200', timestamp: 1625184000 }
              ]
            }
          }
        };
      }
      return {
        data: {
          data: {
            coin: { uuid: '42' }
          }
        }
      };
    }
    if (args.url.includes('/exchanges')) {
      return {
        data: {
          data: {
            exchanges: [
              { uuid: '1', name: 'Exchange 1' },
              { uuid: '2', name: 'Exchange 2' }
            ]
          }
        }
      };
    }
    return { data: { data: {} } };
  },
  createApi: jest.requireActual('@reduxjs/toolkit/query/react').createApi
}));

describe('cryptoApi', () => {
  describe('createRequest', () => {
    it('создает правильный объект запроса с заголовками', () => {
      const url = '/test-url';
      const request = cryptoApi.endpoints.getCryptos.initiate(10);

      expect(request.queryFn).toBeDefined();
      expect(request.type).toBe('query');
      expect(request.endpointName).toBe('getCryptos');
    });

    it('использует правильные заголовки для всех запросов', async () => {
      await store.dispatch(cryptoApi.endpoints.getCryptos.initiate(10));

      await store.dispatch(cryptoApi.endpoints.getCryptoDetails.initiate('42'));

      await store.dispatch(
        cryptoApi.endpoints.getCryptoHistory.initiate({
          coinId: '42',
          timePeriod: '24h'
        })
      );

      await store.dispatch(cryptoApi.endpoints.getExchanges.initiate());
    });
  });

  describe('endpoints', () => {
    it('getCryptosQuery формирует правильный URL', async () => {
      const result = await store.dispatch(cryptoApi.endpoints.getCryptos.initiate(5));
      expect(result.data.data.coins).toHaveLength(5);
    });

    it('getCryptoDetailsQuery формирует правильный URL', async () => {
      const result = await store.dispatch(cryptoApi.endpoints.getCryptoDetails.initiate('42'));
      expect(result.data.data.coin.uuid).toBe('42');
    });

    it('getCryptoHistoryQuery формирует правильный URL', async () => {
      const result = await store.dispatch(
        cryptoApi.endpoints.getCryptoHistory.initiate({
          coinId: '42',
          timePeriod: '24h'
        })
      );
      expect(result.data.data.history).toHaveLength(2);
    });

    it('getExchangesQuery формирует правильный URL', async () => {
      const result = await store.dispatch(cryptoApi.endpoints.getExchanges.initiate());
      expect(result.data.data.exchanges).toHaveLength(2);
    });
  });

  describe('hooks', () => {
    const renderHook = hook => {
      const result = hook();
      return { result, waitForNextUpdate: () => Promise.resolve() };
    };

    it('useGetCryptosQuery возвращает правильные данные', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        cryptoApi.endpoints.getCryptos.useQuery(5)
      );
      await waitForNextUpdate();
      expect(result.data.data.coins).toHaveLength(5);
    });

    it('useGetCryptoDetailsQuery возвращает правильные данные', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        cryptoApi.endpoints.getCryptoDetails.useQuery('42')
      );
      await waitForNextUpdate();
      expect(result.data.data.coin.uuid).toBe('42');
    });

    it('useGetCryptoHistoryQuery возвращает правильные данные', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        cryptoApi.endpoints.getCryptoHistory.useQuery({
          coinId: '42',
          timePeriod: '24h'
        })
      );
      await waitForNextUpdate();
      expect(result.data.data.history).toHaveLength(2);
    });

    it('useGetExchangesQuery возвращает правильные данные', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        cryptoApi.endpoints.getExchanges.useQuery()
      );
      await waitForNextUpdate();
      expect(result.data.data.exchanges).toHaveLength(2);
    });
  });
});
