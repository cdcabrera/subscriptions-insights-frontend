import React from 'react';
import { shallow } from 'enzyme';
import { chartHelpers } from '../chartHelpers';

describe('ChartHelpers', () => {
  it('should return specific properties', () => {
    expect(chartHelpers).toMatchSnapshot('specific properties');
  });

  it('should generate a max x, max y from datasets', () => {
    const options = {
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'dolor',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ]
    };

    expect(chartHelpers.generateMaxXY(options)).toMatchSnapshot('max x, y');
  });

  it('should generate domain ranges', () => {
    const options = {
      maxY: 200
    };

    expect(chartHelpers.generateDomains(options)).toMatchSnapshot('domain, maxY number');

    options.maxY = {
      lorem: 10,
      ipsum: 100,
      dolor: 100
    };
    expect(chartHelpers.generateDomains(options)).toMatchSnapshot('domain, maxY object');
  });

  it('should generate element props', () => {
    const options = {
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'dolor',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ],
      maxX: 6,
      maxY: 200
    };

    expect(chartHelpers.generateElementsProps(options)).toMatchSnapshot('props');
  });

  it('should generate tooltip data/content', () => {
    const mockContent = jest.fn();
    const options = {
      content: mockContent,
      dataSets: [
        {
          id: 'lorem',
          data: [
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 },
            { x: 4, y: 10 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'ipsum',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        },
        {
          id: 'dolor',
          isStacked: true,
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 50 },
            { x: 4, y: 100 },
            { x: 5, y: 10 }
          ]
        }
      ]
    };

    expect(chartHelpers.generateTooltipData(options)).toMatchSnapshot('tooltip, settings');
    expect(mockContent.mock.calls).toMatchSnapshot('tooltip, content');
  });
});
