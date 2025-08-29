/* eslint-env jest */
import '@testing-library/jest-dom';
import React from 'react';

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

global.React = React;

jest.mock('prop-types', () => ({
  ...jest.requireActual('prop-types'),
  any: jest.fn(),
  array: jest.fn(),
  bool: jest.fn(),
  func: jest.fn(),
  number: jest.fn(),
  object: jest.fn(),
  string: jest.fn(),
  symbol: jest.fn(),
  element: jest.fn(),
  node: jest.fn(),
  instanceOf: jest.fn(),
  oneOf: jest.fn(),
  oneOfType: jest.fn(),
  arrayOf: jest.fn(),
  objectOf: jest.fn(),
  shape: jest.fn(),
  exact: jest.fn()
}));
