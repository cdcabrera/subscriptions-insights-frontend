/* eslint-disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'victory-create-container';
import { ChartCursorTooltip, ChartVoronoiContainer, ChartContainer } from '@patternfly/react-charts';
import _cloneDeep from 'lodash/cloneDeep';
import container from "./chartArea";
import containerRef from "./chartArea";
import { ChartContext } from './chartContext';

/**
 * Generate a compatible Victory tooltip component.
 */
const ChartTooltip = ({ content, container: old, containerRef: oldref, coordinateXPadding, coordinateYPadding, containerComponent, ...props }) => {
  const { container, containerRef: ucr } = React.useContext(ChartContext);
  const tr = useRef(null);

  // const containerRef = ucr().current;
  // const tooltipRef = tr.current;
  // const containerBounds = (containerRef && containerRef.getBoundingClientRect()) || { width: 0, height: 0 };
  // const tooltipBounds = (tooltipRef && tooltipRef.getBoundingClientRect()) || { width: 0, height: 0 };
  // const htmlContent = applyParsedTooltipData({ ...obj });
  // const htmlContent = 'hello world';


  const getXCoordinate = (x, width, tooltipWidth) => {
    const paddingVoroni = 0;//50;
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
      const padding = 15;
      return (y > height / 2) ? (y - tooltipHeight) - padding : y + padding;
    }

    return height * 0.25
  };

  const tailPosition = (x, y, width, tooltipWidth) => {
    const paddingVoroni = 0;//50;
    const halfTooltipWidth = tooltipWidth * 0.66; //(tooltipWidth / 2) + paddingVoroni;
    const minChartWidth = 500;

    if (width <= minChartWidth && x > halfTooltipWidth && x < minChartWidth - halfTooltipWidth) {
      return 'middle';
    }

    return x > width / 2 ? 'right' : 'left';
  };

  const FlyoutComponent = obj => {
    const containerRef = ucr()?.current?.querySelector('svg');
    const tooltipRef = tr?.current;
    const containerBounds = containerRef?.getBoundingClientRect() || { width: 0, height: 0 };
    const tooltipBounds = tooltipRef?.getBoundingClientRect() || { width: 0, height: 0 };
    const htmlContent = 'hello world';

    if (htmlContent) {
      const updatedClassName = `${tooltipBounds.height <= 0 && 'fadein' || ''}`;
      // TODO: convert "obj.y > containerBounds.height - 80" to pull from the lower/bottom padding instead
      return (
        <g>
          <foreignObject
            x={getXCoordinate(obj.x, containerBounds.width, tooltipBounds.width)}
            y={getYCoordinate(obj.y, containerBounds.height, tooltipBounds.height, containerBounds.width)}
            width="100%"
            height="100%"
          >
            <div className={`curiosity-chartarea__tooltip-container ${updatedClassName}`} ref={tooltipRef} style={{ display: (obj.y > containerBounds.height - 80 && 'none') || 'inline-block' }} xmlns="http://www.w3.org/1999/xhtml">
              <div className={`curiosity-chartarea__tooltip curiosity-chartarea__tooltip-${ tailPosition(obj.x, obj.y, containerBounds.width, tooltipBounds.width) }`}>
                {htmlContent}
              </div>
            </div>
          </foreignObject>
        </g>
      );
    }

    return <g />;
  };

  // return <FlyoutComponent />;

  const FlyoutComponentworksish = obj => {
    console.log('obj >>>', obj.x, obj.y);
    return <g />;
  };

  return (
    <ChartCursorTooltip
      containerComponent={container}
      dx={0}
      dy={0}
      centerOffset={{ x: 0, y: 0 }}
      flyoutStyle={{ fill: 'transparent', stroke: 'transparent' }}
      labelComponent={<FlyoutComponent />}
      {...props}
    />
  );

  // const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
  // const FlyoutComponent = obj => {
  // console.log('>>>', container);
  // console.log('>>>', containerRef()?.current);
  // return <g />;
  // };

  // const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');

  // return <FlyoutComponent />;

  return (
    <Container
      {...props}
      cursorDimension="x"
      labels={obj => obj}
      labelComponent={<ChartCursorTooltip
        // {...props?.labelComponent?.props}
        dx={0}
        dy={0}
        centerOffset={{ x: 0, y: 0 }}
        flyoutStyle={{ fill: 'transparent' }}
        labelComponent={<FlyoutComponent />}
      />}
      voronoiPadding={coordinateXPadding}
      mouseFollowTooltips
    />);


  /* works when you dont include the victory components here
  console.log('>>>', containerRef?.current);
  return <g />;
   */

  /*
  const FlyoutComponent = obj => {
    console.log('>>>', obj);
    return <g />;
  };

  return <VictoryVoronoiCursorContainer
    {...props}
    cursorDimension="x"
    labels={obj => obj}
    labelComponent={<ChartCursorTooltip
      dx={0}
      dy={0}
      centerOffset={{ x: 0, y: 0 }}
      flyoutStyle={{ fill: 'transparent' }}
      labelComponent={<FlyoutComponent />}
    />}
    voronoiPadding={coordinateXPadding}
    mouseFollowTooltips
  />;
  */
}

ChartTooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  containerRef: PropTypes.func,// .isRequired,
  coordinateXPadding: PropTypes.number,
  coordinateYPadding: PropTypes.number,
  dataSets: PropTypes.array // .isRequired
};

ChartTooltip.defaultProps = {
  content: null,
  coordinateXPadding: 50,
  coordinateYPadding: 15,
};

export { ChartTooltip as default, ChartTooltip };
