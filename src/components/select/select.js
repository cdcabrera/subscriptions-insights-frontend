import React from 'react';
import PropTypes from 'prop-types';
import { Select as PfSelect, SelectOption as PfSelectOption, SelectVariant } from '@patternfly/react-core';
import { helpers } from '../../common/helpers';

const Select = ({ variant, 'aria-label': ariaLabel, onToggle, onSelect, selections, isExpanded, options }) => (
  <PfSelect
    variant={variant}
    aria-label={ariaLabel}
    onToggle={onToggle}
    onSelect={onSelect}
    selections={selections}
    isExpanded={isExpanded}
  >
    {options.map(option => (
      <PfSelectOption key={option.value} value={option.value} isPlaceholder={option.isPlaceholder} />
    ))}
  </PfSelect>
);

Select.propTypes = {
  variant: PropTypes.oneOf(['single', 'checkbox', 'typeahead', 'typeaheadmulti']),
  'aria-label': PropTypes.string,
  onToggle: PropTypes.func,
  onSelect: PropTypes.func,
  selections: PropTypes.object,
  isExpanded: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object)
};

Select.defaultProps = {
  variant: SelectVariant.single,
  'aria-label': '',
  onToggle: helpers.noop,
  onSelect: helpers.noop,
  selections: null,
  isExpanded: false,
  options: []
};

export { Select as default, Select };
