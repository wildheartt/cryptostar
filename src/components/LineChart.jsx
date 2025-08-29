import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Col, Row, Typography } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

const { Title } = Typography;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  const coinPrice = [];
  const coinTimestamp = [];

  for (let i = 0; i < (coinHistory?.data?.history?.length || 0); i += 1) {
    const point = coinHistory.data.history[i];
    coinPrice.push(point.price);
    coinTimestamp.push(new Date(point.timestamp * 1000).toLocaleDateString());
  }

  const data = {
    labels: coinTimestamp.slice().reverse(),
    datasets: [
      {
        label: 'Price (USD)',
        data: coinPrice.slice().reverse(),
        borderColor: '#0071bd',
        backgroundColor: '#0071bd',
        fill: false,
        tension: 0.25
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">
          {coinName} Price Chart
        </Title>
        <Col className="price-container">
          <Title level={5} className="price-change">
            Change: {coinHistory?.data?.change}%
          </Title>
          <Title level={5} className="current-price">
            Current {coinName} Price: ${currentPrice}
          </Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  );
};

/* --- PropTypes для линтера --- */
LineChart.propTypes = {
  coinHistory: PropTypes.shape({
    data: PropTypes.shape({
      change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      history: PropTypes.arrayOf(
        PropTypes.shape({
          price: PropTypes.number,
          timestamp: PropTypes.number
        })
      )
    })
  }).isRequired,
  currentPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  coinName: PropTypes.string.isRequired
};

export default LineChart;
