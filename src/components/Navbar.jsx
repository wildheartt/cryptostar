import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Typography, Avatar, Button } from 'antd';
import { MenuOutlined, HomeOutlined, FundOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import icon from '../images/bitcoin.png';

const menuItems = [
  {
    label: <Link to="/">Главная</Link>,
    key: 'home',
    icon: <HomeOutlined />
  },
  {
    label: <Link to="/cryptocurrencies">Криптовалюты</Link>,
    key: 'cryptocurrencies',
    icon: <FundOutlined />
  },
  {
    label: <Link to="/exchanges">Биржи</Link>,
    key: 'exchanges',
    icon: <MoneyCollectOutlined />
  }
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" aria-label="avatar" />
        <Typography.Title level={2} className="logo">
          <Link to="/">Криптостар</Link>
        </Typography.Title>
        <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}>
          <MenuOutlined />
        </Button>
      </div>

      {activeMenu && <Menu theme="dark" items={menuItems} />}
    </div>
  );
};

export default Navbar;
