import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ProductViewContext } from '../../components/productView/productViewContext';
import { getRouteConfigByPath } from '../../components/router/routerHelpers';
import { GraphCard } from '../../components/graphCard/graphCard';
import { productConfig } from '../../config';

const RhelGraphCard = ({ productToDisplay }) => {
  const { firstMatch } = getRouteConfigByPath({ pathName: productToDisplay });
  const productGroup = firstMatch?.productGroup;

  console.log('first match >>>', firstMatch, GraphCard);

  const renderProduct = useCallback(() => {
    const updated = config => {
      const { productId, viewId } = config;

      if (!productId || !viewId) {
        return null;
      }

      return (
        <ProductViewContext.Provider value={config} key={`product_${productId}`}>
          test
        </ProductViewContext.Provider>
      );
    };

    updated(firstMatch);
  }, [firstMatch]);

  return (productGroup && renderProduct()) || null;
};

/**
 * Prop types.
 *
 * @type {{productToDisplay: string}}
 */
RhelGraphCard.propTypes = {
  productToDisplay: PropTypes.oneOf([...productConfig.sortedConfigs().byAnythingPathIds])
};

/**
 * Default props.
 *
 * @type {{productToDisplay: string}}
 */
RhelGraphCard.defaultProps = {
  productToDisplay: 'rhel'
};

export { RhelGraphCard as default, RhelGraphCard };
