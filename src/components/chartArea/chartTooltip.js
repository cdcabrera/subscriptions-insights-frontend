/* eslint-disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  VictoryTooltip as ChartCursorTooltip
} from 'victory';
// import { useGetChartContext } from './chartContext';

const getXCoordinate = ({ x, width, tooltipWidth, padding = 0, minChartWidth = 500 } = {}) => {
  // const tooltipWidthDimension = tooltipWidth * 0.66;
  // const tooltipWidthDimension = (tooltipWidth / 2) + padding;

  // if (width <= minChartWidth && x > tooltipWidthDimension && x < minChartWidth - tooltipWidth + padding) {
  if (width <= minChartWidth && x > (tooltipWidth / 2) + padding && x < minChartWidth - tooltipWidth + padding) {
    return (x + padding) - (tooltipWidth / 2);
  }

  return (x > width / 2)? x - tooltipWidth + padding : x + padding;
};

const getYCoordinate = ({ y, height, tooltipHeight, width, padding = 15, minChartWidth = 500 } = {}) => {
  if (width <= minChartWidth) {
    return (y > height / 2) ? (y - tooltipHeight) - padding : y + padding;
  }

  return height * 0.25
};

const tailPosition = ({ x, y, width, tooltipWidth, padding = 0, minChartWidth = 500 } = {}) => {
  // const tooltipWidthDimension = (tooltipWidth / 2) + padding;
  // const tooltipWidthDimension = tooltipWidth * 0.66;

  // if (width <= minChartWidth && x > tooltipWidthDimension && x < minChartWidth - tooltipWidthDimension) {
  if (width <= minChartWidth && x > (tooltipWidth / 2) + padding && x < minChartWidth - tooltipWidth + padding) {
    return 'middle';
  }

  return x > width / 2 ? 'right' : 'left';
};


/**
 * Generate a compatible Victory tooltip component.
 */
// const ChartTooltip = ({ content, containerRef, x, y }) => {
const ChartTooltip = ({ chartSettings, chartContainerRef, chartTooltipRef }) => {
  // console.log('CONTENT >>>', containerBounds);
  // console.log('CONTENT >>>', tooltipBounds);
  // console.log('CONTENT >>>', content);

  const Tooltip = ({ x, y, datum = {} }) => {
    const containerRef = chartContainerRef();
    const tooltipRef = chartTooltipRef();
    const content = chartSettings?.tooltipDataSetLookUp?.[datum.x]?.tooltip || '';
    const containerBounds = containerRef?.current?.querySelector('svg')?.getBoundingClientRect() || { width: 0, height: 0 };
    const tooltipBounds = tooltipRef?.current?.getBoundingClientRect() || { width: 0, height: 0 };

    if (content) {
      const updatedClassName = `${tooltipBounds.height <= 0 && 'fadein' || ''}`;

      return (
        <g>
          <foreignObject
            x={getXCoordinate({x, width: containerBounds.width, tooltipWidth: tooltipBounds.width})}
            y={getYCoordinate({y, height: containerBounds.height, tooltipHeight: tooltipBounds.height, width: containerBounds.width})}
            width="100%"
            height="100%"
          >
            <div className={`curiosity-chartarea__tooltip-container ${updatedClassName}`} ref={tooltipRef} style={{display: (y > containerBounds.height - 80 && 'none') || 'inline-block'}} xmlns="http://www.w3.org/1999/xhtml">
              <div className={`curiosity-chartarea__tooltip curiosity-chartarea__tooltip-${tailPosition({x, y, width: containerBounds.width, tooltipWidth: tooltipBounds.width})}`}>
                {content}
              </div>
            </div>
          </foreignObject>
        </g>
      );
    }

    return <g/>;
  }

  const Base = ({ ...props }) => <ChartCursorTooltip
    {...props}
    dx={0}
    dy={0}
    centerOffset={{ x: 0, y: 0 }}
    flyoutStyle={{ fill: 'transparent', stroke: 'transparent' }}
    labelComponent={<Tooltip />}
  />

  return Tooltip;
  // return Base;
};
/*
const ChartTooltip = ({ content, coordinateXPadding, coordinateYPadding, x: inheritedX, y: inheritedY, datum: inheritedDatum, ...props }) => {
  // const { container, containerRef: ucr } = React.useContext(ChartContext);
  const { chartSettings = {}, chartContainerRef: ucr } = useGetChartContext();
  const tr = useRef(null);

  const applyParsedTooltipData = ({ datum = {} }) => chartSettings?.tooltipDataSetLookUp?.[datum.x]?.tooltip || '';

  const getXCoordinate = (x, width, tooltipWidth) => {
    const paddingVoroni = 0;//50; //coordinateXPadding
    const halfTooltipWidth = tooltipWidth * 0.66; //(tooltipWidth / 2) + paddingVoroni;
    const minChartWidth = 500;

    if (width <= minChartWidth && x > halfTooltipWidth && x < minChartWidth - halfTooltipWidth) {
      return (x + paddingVoroni) - (tooltipWidth / 2);
    }

    return (x > width / 2)? x - tooltipWidth + paddingVoroni : x + paddingVoroni;
  };

  const getYCoordinate = (y, height, tooltipHeight, width) => {
    const minChartWidth = 500;

    if (width <= minChartWidth) {
      const padding = 15; //coordinateYPadding
      // const padding = 0;
      return (y > height / 2) ? (y - tooltipHeight) - padding : y + padding;
    }

    return height * 0.25
  };

  const tailPosition = (x, y, width, tooltipWidth) => {
    // const paddingVoroni = 0;//50; //coordinateXPadding
    const halfTooltipWidth = tooltipWidth * 0.66; //(tooltipWidth / 2) + paddingVoroni;
    const minChartWidth = 500;

    if (width <= minChartWidth && x > halfTooltipWidth && x < minChartWidth - halfTooltipWidth) {
      return 'middle';
    }

    return x > width / 2 ? 'right' : 'left';
  };

  const containerRef = ucr?.current?.querySelector('svg');
  const tooltipRef = tr?.current;
  const containerBounds = containerRef?.getBoundingClientRect() || { width: 0, height: 0 };
  const tooltipBounds = tooltipRef?.getBoundingClientRect() || { width: 0, height: 0 };
  const htmlContent = applyParsedTooltipData({ datum: inheritedDatum });

  console.log('htmlContent', chartSettings?.tooltipDataSetLookUp);

  if (htmlContent) {
    const updatedClassName = `${tooltipBounds.height <= 0 && 'fadein' || ''}`;
    // TODO: convert "inheritedY > containerBounds.height - 80" to pull from the lower/bottom padding instead
    return (
      <g>
        <foreignObject
          x={getXCoordinate(inheritedX, containerBounds.width, tooltipBounds.width)}
          y={getYCoordinate(inheritedY, containerBounds.height, tooltipBounds.height, containerBounds.width)}
          width="100%"
          height="100%"
        >
          <div className={`curiosity-chartarea__tooltip-container ${updatedClassName}`} ref={tr} style={{ display: (inheritedY > containerBounds.height - 80 && 'none') || 'inline-block' }} xmlns="http://www.w3.org/1999/xhtml">
            <div className={`curiosity-chartarea__tooltip curiosity-chartarea__tooltip-${ tailPosition(inheritedX, inheritedY, containerBounds.width, tooltipBounds.width) }`}>
              {htmlContent}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  return <g />;
}
 */

ChartTooltip.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  containerRef: PropTypes.func,// .isRequired,
  coordinateXPadding: PropTypes.number,
  coordinateYPadding: PropTypes.number,
  dataSets: PropTypes.array // .isRequired
};

ChartTooltip.defaultProps = {
  x: 0,
  y: 0,
  content: null,
  coordinateXPadding: 50,
  coordinateYPadding: 15,
};

export { ChartTooltip as default, ChartTooltip };
