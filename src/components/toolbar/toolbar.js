import React from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar as PfToolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { Select } from '../form/select';
import { reduxTypes, store } from '../../redux';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { toolbarTypes } from './toolbarTypes';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Application filter toolbar.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onClearFilter
 * @fires onCategorySelect
 * @fires onSlaSelect
 * @fires onUsageSelect
 */
class Toolbar extends React.Component {
  state = { filterCategory: null, activeCategories: new Set() };

  /**
   * Clear all filters' state.
   *
   * @event onClear
   */
  onClear = () => {
    this.setState({ filterCategory: null, activeCategories: new Set() }, () => {
      this.setDispatchFilter(reduxTypes.rhsm.SET_CLEAR_FILTERS, {
        clearFilters: {
          [rhsmApiTypes.RHSM_API_QUERY_SLA]: null,
          [rhsmApiTypes.RHSM_API_QUERY_USAGE]: null
        }
      });
    });
  };

  /**
   * Clear individual filter state.
   *
   * @event onClearFilter
   * @param {string} categoryTitle
   */
  onClearFilter = categoryTitle => {
    const { filterCategory, activeCategories } = this.state;
    const updatedActiveCategories = new Set(activeCategories);
    const categoryOptions = toolbarTypes.getOptions();
    const { value: categoryValue } = categoryOptions.options.find(({ title }) => title === categoryTitle) || {};

    if (!categoryValue) {
      return;
    }

    updatedActiveCategories.delete(categoryValue);

    const updatedFilterCategory = (updatedActiveCategories.size > 0 && filterCategory) || null;

    this.setState({ filterCategory: updatedFilterCategory, activeCategories: updatedActiveCategories }, () => {
      this.setDispatchFilter(reduxTypes.rhsm.SET_CLEAR_FILTERS, {
        clearFilters: {
          [categoryValue]: null
        }
      });
    });
  };

  /**
   * Set Category selection.
   *
   * @event onCategorySelect
   * @param {object} event
   */
  onCategorySelect = event => {
    const { value } = event;
    this.setState({ filterCategory: value });
  };

  /**
   * Set SLA filter selection.
   *
   * @event onSlaSelect
   * @param {object} event
   */
  onSlaSelect = event => {
    const { activeCategories } = this.state;
    const { value } = event;
    const updatedActiveCategories = activeCategories.add(rhsmApiTypes.RHSM_API_QUERY_SLA);

    this.setState({ activeCategories: updatedActiveCategories }, () => {
      this.setDispatchFilter(reduxTypes.rhsm.SET_FILTER_SLA_RHSM, { [rhsmApiTypes.RHSM_API_QUERY_SLA]: value });
    });
  };

  /**
   * Set Usage filter selection.
   *
   * @event onUsageSelect
   * @param {object} event
   */
  onUsageSelect = event => {
    const { activeCategories } = this.state;
    const { value } = event;
    const updatedActiveCategories = activeCategories.add(rhsmApiTypes.RHSM_API_QUERY_USAGE);

    this.setState({ activeCategories: updatedActiveCategories }, () => {
      this.setDispatchFilter(reduxTypes.rhsm.SET_FILTER_USAGE_RHSM, { [rhsmApiTypes.RHSM_API_QUERY_USAGE]: value });
    });
  };

  /**
   * Dispatch a Redux store type.
   *
   * @param {string} type
   * @param {object} data
   */
  setDispatchFilter(type, data = {}) {
    const { viewId } = this.props;

    store.dispatch({
      type,
      viewId,
      ...data
    });
  }

  // ToDo: API, in the future, to provide select options.
  /**
   * Available and selected filter options.
   *
   * @param {string} type
   * @param {string|object} query
   * @returns {{optionsSelected: Array, options: Array }}
   */
  static setFilter(type, query = '') {
    const options = toolbarTypes.getOptions(type);
    let filter;

    if (typeof query === 'string') {
      filter = options.options.find(({ value }) => value === query);
    } else {
      filter = typeof query?.[type] === 'string' && options.options.find(({ value }) => value === query?.[type]);
    }

    const optionsSelected = (filter?.title && [filter.title]) || (options?.selected && [options.selected]) || [];

    return { options, optionsSelected };
  }

  /**
   * Render a filter toolbar.
   *
   * @returns {Node}
   */
  render() {
    const { filterCategory } = this.state;
    const { query, isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const { options: categoryOptions, optionsSelected: categoryOptionsSelected } = Toolbar.setFilter(
      null,
      filterCategory
    );

    const { options: slaOptions, optionsSelected: slaOptionsSelected } = Toolbar.setFilter(
      rhsmApiTypes.RHSM_API_QUERY_SLA,
      query
    );
    const { options: usageOptions, optionsSelected: usageOptionsSelected } = Toolbar.setFilter(
      rhsmApiTypes.RHSM_API_QUERY_USAGE,
      query
    );

    return (
      <PfToolbar
        id="curiosity-toolbar"
        className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="sm"
        clearAllFilters={this.onClear}
      >
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Select
                  aria-label={t('curiosity-toolbar.category')}
                  onSelect={this.onCategorySelect}
                  selectedOptions={categoryOptionsSelected}
                  placeholder={t('curiosity-toolbar.categoryPlaceholder')}
                  options={categoryOptions.options}
                  toggleIcon={<FilterIcon />}
                />
              </ToolbarItem>
              <ToolbarFilter
                chips={slaOptionsSelected}
                deleteChip={this.onClearFilter}
                categoryName={t('curiosity-toolbar.slaCategory')}
                showToolbarItem={filterCategory === rhsmApiTypes.RHSM_API_QUERY_SLA}
              >
                <Select
                  aria-label={t('curiosity-toolbar.slaCategory')}
                  onSelect={this.onSlaSelect}
                  selectedOptions={slaOptionsSelected}
                  placeholder={t('curiosity-toolbar.slaPlaceholder')}
                  options={slaOptions.options}
                />
              </ToolbarFilter>
              <ToolbarFilter
                chips={usageOptionsSelected}
                deleteChip={this.onClearFilter}
                categoryName={t('curiosity-toolbar.usageCategory')}
                showToolbarItem={filterCategory === rhsmApiTypes.RHSM_API_QUERY_USAGE}
              >
                <Select
                  aria-label={t('curiosity-toolbar.usageCategory')}
                  onSelect={this.onUsageSelect}
                  selectedOptions={usageOptionsSelected}
                  placeholder={t('curiosity-toolbar.usagePlaceholder')}
                  options={usageOptions.options}
                />
              </ToolbarFilter>
            </ToolbarGroup>
          </ToolbarToggleGroup>
        </ToolbarContent>
      </PfToolbar>
    );
  }
}

/**
 * Prop types
 *
 * @type {{viewId: string, t: Function, query: object, isDisabled: boolean }}
 */
Toolbar.propTypes = {
  query: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_SLA]: PropTypes.string,
    [rhsmApiTypes.RHSM_API_QUERY_USAGE]: PropTypes.string
  }),
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, query: {}, isDisabled: boolean}}
 */
Toolbar.defaultProps = {
  query: {},
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: translate,
  viewId: 'toolbar'
};

export { Toolbar as default, Toolbar };
