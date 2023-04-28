import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarContent, ToolbarItem, ToolbarItemVariant } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { Select, SelectPosition } from '../form/select';
import { translate } from '../i18n/i18n';
import { routerContext } from '../router';

/**
 * A standalone product configuration select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldGroupVariant
 */

/**
 * Generate select field options from config
 *
 * @param {object} options
 * @param {Function} options.useRouteDetail
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail } = {}) => {
  const { availableVariants, firstMatch } = useAliasRouteDetail();
  const options = [];

  availableVariants?.forEach(variant => {
    options.push({ title: variant, value: variant, selected: variant === firstMatch.productId });
  });

  /*
  productConfig?.forEach((obj, index) => {
    options.push({ title: obj.productId, value: obj.productId, isSelected: index === 0 });

    console.log('>>>>>', obj.productVariants);

    if (Array.isArray(obj.productVariants) && obj.productVariants.length) {
      options.push(...obj.productVariants.map(variant => ({ title: variant, value: variant })));
    }
  });
  */

  return options;
};

/**
 * On select update.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useOnSelect = ({ useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch } = {}) => {
  const dispatch = useAliasDispatch();

  return ({ value = null } = {}) => {
    dispatch({
      type: reduxTypes.app.SET_PRODUCT_VARIANT,
      variant: value
    });
  };
};

/**
 * Display a product configuration field with generated options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useSelector
 * @param {Function} props.useToolbarFieldOptions
 * @returns {React.ReactNode}
 */
const ToolbarFieldGroupVariant = ({
  isFilter,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useSelector: useAliasSelector,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const updatedValue = useAliasSelector(({ view }) => view?.product?.variant, null);
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({
    ...option,
    selected: (updatedValue && option.value === updatedValue) || option?.selected
  }));
  console.log('>>>> OPTIONS', options);
  console.log('>>>> OPTIONS updatedValue', updatedValue);

  if (options?.length <= 1) {
    return null;
  }

  return (
    <ToolbarContent>
      <ToolbarItem variant={ToolbarItemVariant.label}>Variant: </ToolbarItem>
      <Select
        aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'product-config'] })}
        onSelect={onSelect}
        options={updatedOptions}
        selectedOptions={updatedValue}
        placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'product-config'] })}
        position={position}
        data-test="toolbarFieldProductConfig"
      />
    </ToolbarContent>
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useSelector: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldGroupVariant.propTypes = {
  isFilter: PropTypes.bool,
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useSelector: PropTypes.func,
  useToolbarFieldOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useSelector: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldGroupVariant.defaultProps = {
  isFilter: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useSelector: storeHooks.reactRedux.useSelector,
  useToolbarFieldOptions
};

export { ToolbarFieldGroupVariant as default, ToolbarFieldGroupVariant, useOnSelect, useToolbarFieldOptions };
