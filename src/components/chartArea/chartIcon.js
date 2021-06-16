import React from 'react';
import PropTypes from 'prop-types';
import { ChartPoint } from '@patternfly/react-charts';
import { EyeIcon, EyeSlashIcon, SquareFullIcon } from '@patternfly/react-icons';
// import cx from 'classnames';
// import { Point } from 'victory';

/**
 * Render a svg symbol/icon.
 *
 * @param {object} props
 * @param {string} props.fill
 * @param {string} props.symbol
 * @param {string} props.size
 * @returns {Node}
 */
const ChartIcon = ({ fill, symbol, size }) => {
  const getIcon = () => {
    switch (symbol) {
      case 'dash':
        return (
          // <svg viewBox="0 0 34 10" xmlns="http://www.w3.org/2000/svg">
          //             <rect width="10" height="10"></rect>
          //             <rect x="12" width="10" height="10"></rect>
          //             <rect x="24" width="10" height="10"></rect>
          //           </svg>
          <svg width="100%" height="100%" viewBox="0 0 38 10" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
            <rect y="5" width="10" height="10" fill={fill} />
            <rect x="14" y="5" width="10" height="10" fill={fill} />
            <rect x="28" y="5" width="10" height="10" fill={fill} />
          </svg>
        );
      case 'threshold':
        return (
          <span style={{ width: `${size * 2}px`, height: `${size}px`, display: 'inline-block' }}>
            <svg width="100%" height="100%" role="img" aria-hidden>
              <line
                x1={0}
                y1={size / 2}
                x2={size * 3}
                y2={size / 2}
                stroke={fill}
                strokeWidth={3}
                strokeDasharray="4,3"
              />
            </svg>
          </span>
        );
      case 'eye':
        return <EyeIcon color={fill} size={size >= 10 && 'sm'} />;
      case 'eyeSlash':
        return <EyeSlashIcon color={fill} size={size >= 10 && 'sm'} />;
      case 'square2':
        return <SquareFullIcon color={fill} size={size >= 10 && 'sm'} />;
      case 'square3':
        return (
          <svg role="img" aria-hidden preserveAspectRatio="xMinYMin meet">
            <ChartPoint x={0} y={0} style={{ fill }} symbol={symbol} size={size} />
          </svg>
        );
      default:
        return (
          <span style={{ width: `${size}px`, height: `${size}px`, display: 'inline-block' }}>
            <svg width="100%" height="100%" role="img" aria-hidden>
              <ChartPoint x={0} y={0} style={{ fill }} symbol={symbol} size={size} />
            </svg>
          </span>
        );
    }
  };

  // return <span className={cx(`victory-icon`, { __threshold: symbol === 'threshold' })}>{getIcon()}</span>;
  return <span className={`victory-icon victory-icon__${symbol}`}>{getIcon()}</span>;

  /*
  // const updatedSize = 10 || size;
  // x="0px" y="0px" preserveAspectRatio="xMinYMin meet"
  const Svg = (
    // <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox={`0 0 ${size} ${size}`}>
    <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      {symbol !== 'dash' && <ChartPoint x={0} y={0} style={{ fill }} symbol={symbol} size={size} />}
      {symbol === 'dash' && <line x1="0" y1="0" x2={size} y2="0" stroke={fill} strokeWidth={3} strokeDasharray="1,1,1" />}
    </svg>
  );
  // data:image/svg+xml;
  // return <img src={Svg} alt="chart symbol" />;
  return <span style={{ display: 'inline-block' }}>{Svg}</span>;
  */
};

ChartIcon.propTypes = {
  fill: PropTypes.string,
  // size: PropTypes.oneOf(['xs', 'sm', 'lrg', 'xlrg']),
  size: PropTypes.number,
  symbol: PropTypes.string // PropTypes.oneOf(...ChartPoint.props.symbol)
};

ChartIcon.defaultProps = {
  fill: 'transparent',
  size: 10, //
  symbol: 'square' // ChartPoint.ChartPointProps.symbol.square
};

export { ChartIcon as default, ChartIcon };
