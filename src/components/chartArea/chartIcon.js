import React from 'react';
import PropTypes from 'prop-types';
import { ChartPoint } from '@patternfly/react-charts';
import { EyeIcon, EyeSlashIcon } from '@patternfly/react-icons';

/**
 * Render an icon for use outside of Victory charts.
 *
 * @param {object} props
 * @param {string} props.fill
 * @param {string} props.symbol
 * @param {string} props.size
 * @returns {Node}
 */
const ChartIcon = ({ fill, symbol, size }) => {
  const setIcon = () => {
    switch (symbol) {
      case 'dash':
        return (
          <svg width="100%" height="100%" viewBox="0 0 38 10" role="img" aria-hidden>
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

  return <span className={`curiosity-chartarea__icon curiosity-chartarea__icon-${symbol}`}>{setIcon()}</span>;
};

ChartIcon.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.number,
  symbol: PropTypes.oneOf(['dash', 'eye', 'eyeSlash', 'square', 'threshold'])
};

ChartIcon.defaultProps = {
  fill: 'transparent',
  size: 10,
  symbol: 'square'
};

export { ChartIcon as default, ChartIcon };
