import React from 'react';
import PropTypes from 'prop-types';

/**
 * Note: Certain APIs/resources require element syntax to work correctly, no longer accepting Functions as components.
 * - React Router
 * - Victory Charts
 */
/**
 * Compensate for APIs/resources, wrap some level of children and return as a component.
 *
 * @param {Node} node
 * @returns {Node}
 */
const CreateElement = ({ node: Node, ...props }) => <Node {...props} />;

/**
 * Prop types.
 *
 * @type {{children: Node}}
 */
CreateElement.propTypes = {
  node: PropTypes.node.isRequired
};

/**
 * Default props.
 *
 * @type {{}}
 */
CreateElement.defaultProps = {};

export { CreateElement as default, CreateElement };
