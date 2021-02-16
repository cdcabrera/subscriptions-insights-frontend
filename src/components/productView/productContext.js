import React from 'react';

const ProductContext = React.createContext();

const useProductContext = () => React.useContext(ProductContext);

export { ProductContext as default, ProductContext, useProductContext };
