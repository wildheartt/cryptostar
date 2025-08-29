import React from 'react';
import { Spin } from 'antd';

const Loader = () => (
  <div style={{ textAlign: 'center', padding: '50px 0' }} data-testid="loader">
    <Spin size="large" />
  </div>
);

export default Loader;
