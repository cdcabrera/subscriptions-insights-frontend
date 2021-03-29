import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common/helpers';
import { rhsmServices } from '../../services/rhsmServices';
import graphPng2x from '../../images/graph2x.png';
import graphPng4x from '../../images/graph4x.png';
import '../../styles/index.scss';

const TextInput = ({ type, label, value, onChange }) => (
  <div className="simple-form-group">
    <img
      srcSet={`${graphPng4x} 1064w, ${graphPng2x} 600w`}
      src={graphPng4x}
      alt="test"
      aria-hidden
      className="curiosity-optin-image"
    />
    <label className="simple-text-label">
      {label}
      {Object(rhsmServices).keys.length || 0}
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
