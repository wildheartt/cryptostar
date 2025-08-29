import React from 'react';

import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';

import { Navbar, Exchanges, Homepage, Cryptocurrencies, CryptoDetails } from './components';
import 'antd/dist/reset.css';

import './App.css';
const App = () => {
  return (
    <Router>
      {' '}
      {/* Единственный роутер во всем приложении */}
      <div className="app">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="main">
          <Layout>
            <div className="routes">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
                <Route path="/exchanges" element={<Exchanges />} />
                <Route path="/crypto/:coinId" element={<CryptoDetails />} />
              </Routes>
            </div>
          </Layout>
          <div className="footer"></div>
        </div>
      </div>
    </Router>
  );
};
export default App;
