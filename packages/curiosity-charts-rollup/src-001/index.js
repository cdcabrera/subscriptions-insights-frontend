import React from 'react';
// import { rhsmServices } from '../../../src/services/rhsmServices';
import { rhsmServices } from './services/rhsmServices';

const CuriosityCharts = () => {
  const count = Object.entries(rhsmServices).length;

  return (
    <div>
      <h2>Welcome to React components {count}</h2>
    </div>
  );
};

export { CuriosityCharts as default, CuriosityCharts };
