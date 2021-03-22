import React from 'react';
// const { rhsmServices } = require('@curiosity/services/rhsmServices');
import { rhsmServices } from './curiosityServices/rhsmServices';
// const { rhsmServices } = require('../../../src/services/rhsmServices');

const CuriosityCharts = () => {
  const count = Object.entries(rhsmServices).length;

  return (
    <div>
      <h2>Welcome to React components {count}</h2>
    </div>
  );
};

export { CuriosityCharts as default, CuriosityCharts };
