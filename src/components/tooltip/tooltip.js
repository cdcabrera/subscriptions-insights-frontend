import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip as PfTooltip, TooltipPosition } from '@patternfly/react-core';

/**
 * PF tooltip wrapper.
 *
 * @memberof Components
 * @module Tooltip
 */

/**
 * PF tooltip wrapper component.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} props.content
 * @param {boolean} props.isNoWrap
 * @param {object} props.props
 * @param props.trigger
 * @param props.isVisible
 * @returns {React.ReactNode}
 */
const Tooltip = ({ children, content, isNoWrap, trigger, isVisible, ...props }) => {
  const [updatedIsVisible, setUpdatedIsVisible] = useState(isVisible);
  const updatedTrigger = (trigger === 'mouseenterclickclose' && 'manual') || trigger;

  /*
  switch (trigger) {
    case 'mouseenterclickclose':
      updatedTrigger = 'manual';
      break;
    default:
      updatedTrigger = trigger;
      break;
  }
  */

  const setIsVisible = () => {
    if (trigger === 'mouseenterclickclose') {
      setUpdatedIsVisible(true);
    }
  };

  const setIsNotVisible = () => {
    if (trigger === 'mouseenterclickclose') {
      setUpdatedIsVisible(false);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus,jsx-a11y/click-events-have-key-events
    <div
      role="button"
      style={{ display: 'inline-block' }}
      onFocus={setIsVisible}
      onBlur={setIsNotVisible}
      onMouseLeave={setIsNotVisible}
      onMouseEnter={setIsVisible}
      onClick={setIsNotVisible}
    >
      <PfTooltip
        // ref={dRef}
        isVisible={updatedIsVisible}
        trigger={updatedTrigger}
        className={`curiosity-tooltip${(isNoWrap && '__nowrap') || ''}`}
        content={(React.isValidElement(content) && content) || <p>{content || ''}</p>}
        {...props}
      >
        {(React.isValidElement(children) && children) || <span className="curiosity-tooltip-children">{children}</span>}
      </PfTooltip>
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, content: React.ReactNode}}
 */
Tooltip.propTypes = {
  trigger: PropTypes.oneOf(['mouseenterclickclose', 'mouseenter', 'focus', 'click', 'manual']),
  isVisible: PropTypes.bool,
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
  trigger: 'mouseenter focus',
  isVisible: false,
  content: '...',
  distance: 15,
  enableFlip: false,
  entryDelay: 100,
  exitDelay: 0,
  isNoWrap: false,
  position: TooltipPosition.top
};

export { Tooltip as default, Tooltip };
