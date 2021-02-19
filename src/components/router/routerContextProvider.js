import React from 'react';
import PropTypes from 'prop-types';
import { useUpdateEffect } from 'react-use';
import { RouterContext } from './routerContext';

/**
 * Router context provider.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {*} props.value
 * @returns {Node}
 */
const RouterContextProvider = ({ children, value }) => {
  const [updatedValue, setUpdatedValue] = React.useState(value);

  useUpdateEffect(() => {
    setUpdatedValue(value);
    console.log('ROUTE CONTX PROVIDER 002 >>>', updatedValue);
  }, [value]);

  console.log('ROUTE CONTX PROVIDER 001 >>>', updatedValue);
  return <RouterContext.Provider value={updatedValue}>{children}</RouterContext.Provider>;
  /*
  const [updatedValue, setUpdatedValue] = React.useState();

  useUpdateEffect(() => {
    setUpdatedValue(value);
    console.log('ROUTE CONTX PROVIDER 002 >>>', updatedValue);
  }, [value]);

  if (updatedValue) {
    console.log('ROUTE CONTX PROVIDER 001 >>>', updatedValue);
    return <RouterContext.Provider value={updatedValue}>{children}</RouterContext.Provider>;
  }

  return null;
  */
};

/**
 * Prop types.
 *
 * @type {{children: Node, value: *}}
 */
RouterContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.any.isRequired
};

/**
 * Default props.
 *
 * @type {{}}
 */
RouterContextProvider.defaultProps = {};

export { RouterContextProvider as default, RouterContextProvider };
