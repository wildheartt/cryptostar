import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cryptocurrencies from '../Cryptocurrencies';

jest.mock('../../services/cryptoApi', () => ({
  useGetCryptosQuery: jest.fn()
}));

const { useGetCryptosQuery } = require('../../services/cryptoApi');

describe('Cryptocurrencies', () => {
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
    },
    {
      uuid: '3',
      rank: 3,
      name: 'Dogecoin',
      price: '0.2',
      marketCap: '30000000',
      change: '5',
      iconUrl: 'https://dogecoin.com/img.png'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает состояние загрузки', () => {
    useGetCryptosQuery.mockReturnValue({
      isFetching: true,
      error: undefined,
      data: undefined
    });

    render(
      <MemoryRouter>
        <Cryptocurrencies />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке', () => {
    const errorMessage = 'Failed to fetch data';
    useGetCryptosQuery.mockReturnValue({
      isFetching: false,
      error: { message: errorMessage },
      data: undefined
    });

    render(
      <MemoryRouter>
        <Cryptocurrencies />
      </MemoryRouter>
    );

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('отображает сообщение при отсутствии данных', () => {
    useGetCryptosQuery.mockReturnValue({
      isFetching: false,
      error: undefined,
      data: { data: { coins: [] } }
    });

    render(
      <MemoryRouter>
        <Cryptocurrencies />
      </MemoryRouter>
    );

    expect(screen.getByText(/no cryptocurrencies found/i)).toBeInTheDocument();
  });

  it('отображает и фильтрует криптовалюты', async () => {
    useGetCryptosQuery.mockReturnValue({
      isFetching: false,
      error: undefined,
      data: { data: { coins: mockCoins } }
    });

    render(
      <MemoryRouter>
        <Cryptocurrencies />
      </MemoryRouter>
    );

    expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
    expect(screen.getByText(/dogecoin/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search cryptocurrency/i);
    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'ethereum' } });
    });
    expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
    expect(screen.queryByText(/dogecoin/i)).not.toBeInTheDocument();
  });

  it('отображает упрощенный список без поля поиска', () => {
    useGetCryptosQuery.mockReturnValue({
      isFetching: false,
      error: undefined,
      data: { data: { coins: mockCoins } }
    });

    render(
      <MemoryRouter>
        <Cryptocurrencies simplified />
      </MemoryRouter>
    );

    expect(screen.queryByPlaceholderText(/search cryptocurrency/i)).not.toBeInTheDocument();

    expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
    expect(screen.getByText(/dogecoin/i)).toBeInTheDocument();

    expect(screen.getAllByText(/цена:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/рыночная капитализация:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/изменение за сутки:/i)[0]).toBeInTheDocument();
  });

  it('корректно отображает ссылки на детали криптовалют', () => {
    useGetCryptosQuery.mockReturnValue({
      isFetching: false,
      error: undefined,
      data: { data: { coins: mockCoins } }
    });

    render(
      <MemoryRouter>
        <Cryptocurrencies />
      </MemoryRouter>
    );

    const bitcoinLink = screen.getByText(/bitcoin/i).closest('a');
    const ethereumLink = screen.getByText(/ethereum/i).closest('a');
    const dogecoinLink = screen.getByText(/dogecoin/i).closest('a');

    expect(bitcoinLink).toHaveAttribute('href', '/crypto/1');
    expect(ethereumLink).toHaveAttribute('href', '/crypto/2');
    expect(dogecoinLink).toHaveAttribute('href', '/crypto/3');
  });
});
