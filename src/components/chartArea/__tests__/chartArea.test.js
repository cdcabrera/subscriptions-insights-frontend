import React from 'react';
import { mount, shallow } from 'enzyme';
import { ChartArea } from '../chartArea';

describe('ChartArea Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<ChartArea {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render basic data', () => {
    const props = {
      dataSetOne: {
        data: [
          {
            x: 1,
            y: 1,
            tooltip: '1 lorem ipsum',
            xAxisLabel: '1 x axis label',
            yAxisLabel: '1 y axis label'
          },
          {
            x: 2,
            y: 2,
            tooltip: '2 lorem ipsum',
            xAxisLabel: '2 x axis label',
            yAxisLabel: '2 y axis label'
          }
        ],
        /*
        thresholds: [
          {
            x: 1,
            y: 1,
            tooltip: '1 threshold tooltip'
          },
          {
            x: 1,
            y: 2,
            tooltip: '2 threshold tooltip'
          }
        ]
        */
        // thresholdStyle: { data: { strokeDasharray: 3.3 } },
        legend: [{ name: 'Arma virumque cano' }, { name: 'Arma virumque cano', symbol: { type: 'dash' } }]
      }
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should allow tick formatting', () => {
    const props = {
      yAxisTickFormat: ({ tick }) => `${tick} dolor sit`,
      dataSetOne: {
        data: [
          {
            x: 1,
            y: 0,
            tooltip: '1 lorem ipsum',
            xAxisLabel: '1 x axis label'
          },
          {
            x: 2,
            y: 1,
            tooltip: '2 lorem ipsum',
            xAxisLabel: '2 x axis label'
          }
        ],
        legend: [{ name: 'Arma virumque cano' }, { name: 'Arma virumque cano', symbol: { type: 'dash' } }]
      }
    };

    const component = shallow(<ChartArea {...props} />);
    expect(component.render()).toMatchSnapshot('y tick format');
  });

  it('should set initial width to zero and then resize', () => {
    const component = shallow(<ChartArea />);

    expect(component.instance().onResizeContainer).toBeDefined();

    // initial state width should be zero
    expect(component.state().chartWidth).toEqual(0);

    // set the container size arbitrarily
    component.instance().containerRef.current = { clientWidth: 100 };
    global.dispatchEvent(new Event('resize'));
    expect(component.state().chartWidth).toEqual(100);

    // set the container size arbitrarily and force handleResize to fire
    component.instance().containerRef.current = { clientWidth: 1337 };
    global.dispatchEvent(new Event('resize'));
    expect(component.state().chartWidth).toEqual(1337);
  });

  it('should run componentWillUnmount method successfully', () => {
    const component = mount(<ChartArea />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });
});
