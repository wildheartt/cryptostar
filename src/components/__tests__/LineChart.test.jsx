import React from 'react';
import { render, screen } from '@testing-library/react';
import LineChart from '../LineChart';

jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mocked-line-chart" />
}));

describe('LineChart', () => {
  const mockProps = {
    coinHistory: {
      history: [
        { price: '100', timestamp: 1625097600 },
        { price: '200', timestamp: 1625184000 }
      ]
    },
    currentPrice: '150',
    coinName: 'Bitcoin'
  };

  it('рендерится без ошибок', () => {
    render(<LineChart {...mockProps} />);
    expect(screen.getByTestId('mocked-line-chart')).toBeInTheDocument();
  });

  it('отображает название криптовалюты', () => {
    render(<LineChart {...mockProps} />);
    expect(screen.getByText(/Bitcoin Price Chart/i)).toBeInTheDocument();
  });

  it('отображает текущую цену', () => {
    render(<LineChart {...mockProps} />);
    expect(screen.getByText(/Current Bitcoin Price: \$150/i)).toBeInTheDocument();
  });

  it('корректно обрабатывает отсутствие данных', () => {
    const emptyProps = {
      ...mockProps,
      coinHistory: { history: [] }
    };
    render(<LineChart {...emptyProps} />);
    expect(screen.getByTestId('mocked-line-chart')).toBeInTheDocument();
  });

  it('корректно обрабатывает отсутствие истории', () => {
    const noHistoryProps = {
      ...mockProps,
      coinHistory: null
    };
    render(<LineChart {...noHistoryProps} />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });
});
