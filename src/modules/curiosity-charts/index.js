import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common/helpers';

const TextInput = ({ type, label, value, onChange }) => (
  <div className="simple-form-group">
    <label className="simple-text-label">
      {label}
      <input
        type={type}
        className="simple-text-input"
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
      />
    </label>
  </div>
);

TextInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func
};

TextInput.defaultProps = {
  type: 'text',
  label: null,
  value: null,
  onChange: helpers.noop
};

export { TextInput as default, TextInput };
