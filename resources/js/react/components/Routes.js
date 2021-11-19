import React from 'react';
import Product from './Product/List';
import Home from './Home/List';

const Routes = [
  {
    path: '/',
    exact: true,
    element: <Home />
  },
  {
    path: '/product',
    exact: true,
    element: <Product />
  },
];

export default Routes;