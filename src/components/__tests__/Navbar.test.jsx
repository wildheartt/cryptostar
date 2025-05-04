import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Мокаем импорт изображения
jest.mock('../images/bitcoin.png', () => 'mocked-image-path');

const renderNavbar = async () => {
  const result = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Криптостар')).toBeInTheDocument();
  });

  return result;
};

describe('Navbar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
  });

  it('отображает все элементы навигации', async () => {
    await renderNavbar();

    expect(screen.getByText('Криптостар')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /avatar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /главная/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /криптовалюты/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /биржи/i })).toBeInTheDocument();
  });

  it('содержит правильные ссылки в меню', async () => {
    await renderNavbar();

    expect(screen.getByRole('link', { name: /главная/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /криптовалюты/i })).toHaveAttribute(
      'href',
      '/cryptocurrencies'
    );
    expect(screen.getByRole('link', { name: /биржи/i })).toHaveAttribute('href', '/exchanges');
  });

  it('имеет правильную структуру навигации', async () => {
    await renderNavbar();

    expect(screen.getByRole('menu')).toHaveClass('ant-menu');
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('menu-control-container');
  });

  it('реагирует на изменение размера экрана', async () => {
    await renderNavbar();

    // Проверяем начальное состояние (большой экран)
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Изменяем размер экрана на маленький (меньше 800px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700
    });

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    // Проверяем, что меню скрылось
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    // Возвращаем большой размер экрана
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    // Проверяем, что меню появилось
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('кнопка-тоггл корректно управляет видимостью меню', async () => {
    await renderNavbar();

    const toggleBtn = screen.getByRole('button');
    expect(toggleBtn).toBeInTheDocument();

    // Проверяем начальное состояние
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Скрываем меню
    await act(async () => {
      fireEvent.click(toggleBtn);
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Показываем меню
    await act(async () => {
      fireEvent.click(toggleBtn);
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('меню скрывается при маленьком размере экрана', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700
    });

    await renderNavbar();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('очищает обработчик события resize при размонтировании', async () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = await renderNavbar();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('инициализирует размер экрана при монтировании', async () => {
    const setScreenSizeSpy = jest.spyOn(React, 'useState');

    await renderNavbar();

    expect(setScreenSizeSpy).toHaveBeenCalledWith(1024);

    setScreenSizeSpy.mockRestore();
  });
});
