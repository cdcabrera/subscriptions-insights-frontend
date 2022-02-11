import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as PfTooltip, TooltipPosition } from '@patternfly/react-core';

/**
 * PF tooltip wrapper component.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {Node} props.content
 * @param {boolean} props.isNoWrap
 * @returns {Node}
 */
const Tooltip = ({ children, content, isNoWrap, ...props }) => (
  <PfTooltip
    className={`curiosity-tooltip${isNoWrap && '__nowrap'}`}
    content={(React.isValidElement(content) && content) || <p>{content || ''}</p>}
    {...props}
  >
    {(React.isValidElement(children) && children) || <span className="curiosity-tooltip-children">{children}</span>}
  </PfTooltip>
);

/**
 * Prop types.
 *
 * @type {{children: Node, content: Node}}
 */
Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node,
  distance: PropTypes.number,
  enableFlip: PropTypes.bool,
  entryDelay: PropTypes.number,
  exitDelay: PropTypes.number,
  isNoWrap: PropTypes.bool,
  position: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{content: string}}
 */
Tooltip.defaultProps = {
  content: '...',
  distance: 5,
  enableFlip: false,
  entryDelay: 100,
  exitDelay: 0,
  isNoWrap: false,
  position: TooltipPosition.top
};

export { Tooltip as default, Tooltip };
