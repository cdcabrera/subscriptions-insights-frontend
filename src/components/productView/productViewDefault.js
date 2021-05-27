import React from 'react';
import PropTypes from 'prop-types';
import { ProductView } from './productView';
import { useProduct } from '../../hooks/useProduct';

/**
 * A default product view.
 *
 * @param {object} props
 * @param {object} props.routeDetail
 * @returns {Node}
 */
const ProductViewDefault = ({ routeDetail }) => {
  const testing = useProduct();
  console.log('PLEASE WORK >>>', testing);
  const View = routeDetail?.productConfig?.view || ProductView;
  return <View routeDetail={routeDetail} />;
};

/**
 * Prop types.
 *
 * @type {{routeDetail: object}}
 */
ProductViewDefault.propTypes = {
  routeDetail: PropTypes.shape(ProductView.propTypes.routeDetail).isRequired
};

/**
 * Default props.
 */
ProductViewDefault.defaultProps = {};

export { ProductViewDefault as default, ProductViewDefault };
