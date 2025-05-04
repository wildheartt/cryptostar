import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import millify from 'millify';
import Exchanges from '../Exchanges';

jest.mock('../Loader', () => () => <div data-testid="loader">Loading...</div>);

jest.mock('../../services/exchangeApi', () => ({
  useGetExchangesQuery: jest.fn()
}));
import { useGetExchangesQuery } from '../../services/exchangeApi';

describe('Exchanges component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('показывает Loader, пока идёт загрузка', () => {
    useGetExchangesQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: false
    });

    render(<Exchanges />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('показывает Empty при ошибке или пустом массиве', () => {
    useGetExchangesQuery.mockReturnValue({
      data: [],
      isFetching: false,
      error: true
    });
    const { rerender } = render(<Exchanges />);
    expect(screen.getByText(/Список бирж недоступен \(нужен премиум-план\)/)).toBeInTheDocument();

    useGetExchangesQuery.mockReturnValue({
      data: [],
      isFetching: false,
      error: false
    });
    rerender(<Exchanges />);
    expect(screen.getByText(/Список бирж недоступен \(нужен премиум-план\)/)).toBeInTheDocument();
  });

  test('рендерит список бирж с корректными данными', () => {
    const exchange = {
      uuid: 'ex1',
      rank: 1,
      name: 'TestExchange',
      image: 'https://example.com/logo.png',
      trade_volume_24h_btc: 1000,
      trust_score_rank: 5,
      trust_score: 7,
      description: '<p>Описание биржи</p>'
    };

    useGetExchangesQuery.mockReturnValue({
      data: [exchange],
      isFetching: false,
      error: false
    });

    render(<Exchanges />);

    expect(screen.getByText('Биржа')).toBeInTheDocument();
    expect(screen.getByText('Объём 24 ч')).toBeInTheDocument();
    expect(screen.getByText('Рынков')).toBeInTheDocument();
    expect(screen.getByText('Доля рынка')).toBeInTheDocument();

    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('TestExchange')).toBeInTheDocument();
    expect(screen.getByText(millify(exchange.trade_volume_24h_btc))).toBeInTheDocument();
    expect(screen.getByText(String(exchange.trust_score_rank))).toBeInTheDocument();
    expect(screen.getByText(String(exchange.trust_score))).toBeInTheDocument();

    const header = screen.getByText('TestExchange');
    fireEvent.click(header);
    expect(screen.getByText('Описание биржи')).toBeInTheDocument();
  });
});
