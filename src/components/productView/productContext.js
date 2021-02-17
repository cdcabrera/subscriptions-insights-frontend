import React from 'react';
// import { helpers } from '../../common';

/**
 * Product context.
 *
 * @type {React.Context<{}>}
 */
const ProductContext = React.createContext({
  // productConfig: {},
  // setProductConfig: helpers.noop
});

/**
 * Expose product context.
 *
 * @returns {*}
 */
const useProductContext = () => React.useContext(ProductContext);
/*
const useProductContext = value => {
  const { productConfig = value } = React.useContext(ProductContext);
  return productConfig;
  //return (filter && filter(productConfig)) || productConfig;
};

const useProductContextFiltered = (filter, value) => {
  const { productConfig = value } = useProductContext();
  return (filter && filter(productConfig)) || productConfig;
};
 */
const useProductContextFiltered = (filter, value = {}) => {
  const { productConfig = value } = useProductContext();
  const applyFilter = () => (filter && filter(productConfig)) || productConfig;
  return applyFilter();
};

const useProductContextGraphFilters = (filter, value = []) => {
  const productConfig = useProductContext();
  const { initialGraphFilters = value } = productConfig;

  const applyFilter = () => {
    const filterFilters = ({ id, isOptional }) => {
      if (!isOptional) {
        return true;
      }
      return new RegExp(filter, 'i').test(id);
    };

    return (filter && initialGraphFilters.filter(filterFilters)) || initialGraphFilters;
  };

  return applyFilter();
  // const { initialGraphFilters = [] } = productConfig;
  /*
  const [initialGraphFilters, setInitialGraphFilters] = React.useState(productConfig.initialGraphFilters);

  React.useEffect(() => {
    const filterFilters = ({ id, isOptional }) => {
      if (!isOptional) {
        return true;
      }
      return new RegExp(filter, 'i').test(id);
    };

    if (filter) {
      setInitialGraphFilters(initialGraphFilters?.filter(filterFilters));
    } else {
      setInitialGraphFilters(initialGraphFilters);
    }
  }, [filter, initialGraphFilters]);

  return initialGraphFilters;
  */
  /*
  (initialGraphFilters = []) => {
    const filterFilters = ({ id, isOptional }) => {
      if (!isOptional) {
        return true;
      }
      return new RegExp(filterOption, 'i').test(id);
    };

    return {
      initialGraphFilters: initialGraphFilters.filter(filterFilters)
    };
    */

  // const { initialGraphFilters } = productConfig;
  // return (filter && filter(initialGraphFilters)) || initialGraphFilters;
};

export {
  ProductContext as default,
  ProductContext,
  useProductContext,
  useProductContextFiltered,
  useProductContextGraphFilters
};
