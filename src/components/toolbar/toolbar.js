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
import _isEqual from 'lodash/isEqual';
import { connect, reduxTypes, store, useSelector } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { ToolbarFieldSla, toolbarFieldOptions as slaOptions } from './toolbarFieldSla';
import { ToolbarFieldUsage, toolbarFieldOptions as usageOptions } from './toolbarFieldUsage';
import { ToolbarFieldCategory, toolbarFieldOptions as categoryOptions } from './toolbarFieldCategory';

/**
 * Application filter toolbar.
 *
 * @augments React.Component
 * @fires onClearAllFilters
 * @fires onClearFilter
 */
/*
class Toolbar extends React.Component {
  componentDidUpdate(prevProps) {
    const { query } = this.props;
    console.log('onupdate >>>', _isEqual(query, prevProps.query));
    // if (!_isEqual(query, prevProps.query)) {
    // }
  }

  /**
   * Clear all filters' state.
   *
   * @event onClearAllFilters
   * /
  onClearAllFilters = () => {
    const { viewId } = this.props;

    store.dispatch({
      type: reduxTypes.query.SET_QUERY_CLEAR,
      viewId,
      clearFilters: {
        [RHSM_API_QUERY_TYPES.SLA]: null,
        [RHSM_API_QUERY_TYPES.USAGE]: null
      }
    });
  };

  /**
   * Clear individual filter state.
   *
   * @event onClearFilter
   * @param {string} categoryTitle
   * /
  onClearFilter = categoryTitle => {
    const { viewId } = this.props;
    const { value: categoryValue } = categoryOptions.find(({ title }) => title === categoryTitle) || {};

    if (!categoryValue) {
      return;
    }

    store.dispatch({
      type: reduxTypes.query.SET_QUERY_CLEAR,
      viewId,
      clearFilters: {
        [categoryValue]: null
      }
    });
  };

  /**
   * Return the current category filter, fallback to props selected.
   *
   * @returns {string|undefined}
   * /
  getCurrentCategoryFilter() {
    const { currentFilter, filterOptions } = this.props;

    return (
      currentFilter ||
      filterOptions.find(({ selected }) => selected === true)?.id ||
      (filterOptions.length === 1 && filterOptions[0]?.id)
    );
  }

  /**
   * Available, and selected select filter options for chip display.
   *
   * @param {string} field
   * @param {Array} options
   * @returns {Array}
   * /
  getSelectedFilterForChips(field, options) {
    const { query } = this.props;
    const filter = typeof query?.[field] === 'string' && options.find(({ value }) => value === query?.[field]);

    return (filter?.title && [filter.title]) || [];
  }

  /**
   * Render a filter node.
   *
   * @param {string} field
   * @returns {Node}
   * /
  renderFiltersWORKSISH(field) {
    const { t, viewId } = this.props;
    const currentCategoryFilter = this.getCurrentCategoryFilter();
    let selectedFilterForChips;
    let filter;

    switch (field) {
      case RHSM_API_QUERY_TYPES.USAGE:
        selectedFilterForChips = this.getSelectedFilterForChips(field, usageOptions);
        filter = <ToolbarFieldUsage viewId={viewId} />;
        break;
      case RHSM_API_QUERY_TYPES.SLA:
      default:
        selectedFilterForChips = this.getSelectedFilterForChips(field, slaOptions);
        filter = <ToolbarFieldSla viewId={viewId} />;
        break;
    }

    return (
      <ToolbarFilter
        key={field}
        chips={selectedFilterForChips}
        deleteChip={this.onClearFilter}
        categoryName={t('curiosity-toolbar.category', { context: field })}
        showToolbarItem={currentCategoryFilter === field}
      >
        {filter}
      </ToolbarFilter>
    );
  }

  renderFilters() {
    const { t, viewId } = this.props;
    const currentCategoryFilter = this.getCurrentCategoryFilter();

    return (
      <React.Fragment>
        <ToolbarFilter
          key={RHSM_API_QUERY_TYPES.SLA}
          chips={this.getSelectedFilterForChips(RHSM_API_QUERY_TYPES.SLA, slaOptions)}
          deleteChip={this.onClearFilter}
          categoryName={t('curiosity-toolbar.category', { context: RHSM_API_QUERY_TYPES.SLA })}
          // showToolbarItem={currentCategoryFilter === RHSM_API_QUERY_TYPES.SLA}
        >
          <ToolbarFieldSla viewId={viewId} />
        </ToolbarFilter>
        <ToolbarFilter
          key={RHSM_API_QUERY_TYPES.USAGE}
          chips={this.getSelectedFilterForChips(RHSM_API_QUERY_TYPES.USAGE, usageOptions)}
          deleteChip={this.onClearFilter}
          categoryName={t('curiosity-toolbar.category', { context: RHSM_API_QUERY_TYPES.USAGE })}
          // showToolbarItem={currentCategoryFilter === RHSM_API_QUERY_TYPES.USAGE}
        >
          <ToolbarFieldUsage viewId={viewId} />
        </ToolbarFilter>
      </React.Fragment>
    );
  }

  /**
   * Render toolbar category select.
   *
   * @returns {Node}
   * /
  renderCategories() {
    const { filterOptions, viewId } = this.props;
    const currentCategoryFilter = this.getCurrentCategoryFilter();
    const options = categoryOptions.filter(({ value }) => filterOptions.find(({ id }) => id === value));

    if (options.length > 1) {
      return (
        <ToolbarItem>
          <ToolbarFieldCategory
            viewId={viewId}
            options={options}
            value={currentCategoryFilter}
            toggleIcon={<FilterIcon />}
          />
        </ToolbarItem>
      );
    }

    return null;
  }

  /**
   * Render a filter toolbar.
   *
   * @returns {Node}
   * /
  render() {
    const { chipGroupSequence, filterOptions, isDisabled } = this.props;

    if (isDisabled) {
      return null;
    }

    // let updatedFilterOptions = filterOptions;

    /*
    if (chipGroupSequence.size) {
      updatedFilterOptions = [];
      Array.from(chipGroupSequence).forEach(field => {
        const filter = filterOptions.find(obj => obj.id === field);
        updatedFilterOptions.push(filter);
      });
    }
    * /

    return (
      <PfToolbar
        id="curiosity-toolbar"
        className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="sm"
        clearAllFilters={this.onClearAllFilters}
      >
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
            <ToolbarGroup variant="filter-group">
              {this.renderCategories()}
              {
                this.renderFilters()
                // updatedFilterOptions.map(({ id }) => this.renderFilters(id))
                // .sort(({ id: a }, { id: b }) => a && a.localeCompare(b))}
              }
            </ToolbarGroup>
          </ToolbarToggleGroup>
        </ToolbarContent>
      </PfToolbar>
    );
  }
}
*/

const Toolbar = ({ filterOptions, isDisabled, query, t, viewId }) => {
  const currentFilter = useSelector(({ toolbar }) => toolbar.filters?.[viewId]?.currentFilter, null);
  const updatedQuery = useSelector(({ view }) => view.query?.[viewId], query);

  if (isDisabled) {
    return null;
  }

  const updatedFilterOptions = categoryOptions.filter(({ value }) => filterOptions.find(({ id }) => id === value));
  const currentCategoryFilter =
    currentFilter ||
    filterOptions.find(({ selected }) => selected === true)?.id ||
    (filterOptions.length === 1 && filterOptions[0]?.id);

  const getSelectedFilterForChips = (field, options) => {
    const filter =
      typeof updatedQuery?.[field] === 'string' && options.find(({ value }) => value === updatedQuery?.[field]);
    return (filter?.title && [filter.title]) || [];
  };

  const onClearAllFilters = () =>
    store.dispatch({
      type: reduxTypes.query.SET_QUERY_CLEAR,
      viewId,
      clearFilters: {
        [RHSM_API_QUERY_TYPES.SLA]: null,
        [RHSM_API_QUERY_TYPES.USAGE]: null
      }
    });

  const onClearFilter = categoryTitle => {
    const { value: categoryValue } = categoryOptions.find(({ title }) => title === categoryTitle) || {};
    if (categoryValue) {
      store.dispatch({
        type: reduxTypes.query.SET_QUERY_CLEAR,
        viewId,
        clearFilters: {
          [categoryValue]: null
        }
      });
    }
  };

  return (
    <PfToolbar
      id="curiosity-toolbar"
      className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
      collapseListedFiltersBreakpoint="sm"
      clearAllFilters={onClearAllFilters}
    >
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
          <ToolbarGroup variant="filter-group">
            {updatedFilterOptions.length > 1 && (
              <ToolbarItem>
                <ToolbarFieldCategory
                  viewId={viewId}
                  options={updatedFilterOptions}
                  value={currentCategoryFilter}
                  toggleIcon={<FilterIcon />}
                />
              </ToolbarItem>
            )}
            <ToolbarFilter
              key={RHSM_API_QUERY_TYPES.SLA}
              chips={getSelectedFilterForChips(RHSM_API_QUERY_TYPES.SLA, slaOptions)}
              deleteChip={onClearFilter}
              categoryName={t('curiosity-toolbar.category', { context: RHSM_API_QUERY_TYPES.SLA })}
              showToolbarItem={currentCategoryFilter === RHSM_API_QUERY_TYPES.SLA}
            >
              <ToolbarFieldSla viewId={viewId} />
            </ToolbarFilter>
            <ToolbarFilter
              key={RHSM_API_QUERY_TYPES.USAGE}
              chips={getSelectedFilterForChips(RHSM_API_QUERY_TYPES.USAGE, usageOptions)}
              deleteChip={onClearFilter}
              categoryName={t('curiosity-toolbar.category', { context: RHSM_API_QUERY_TYPES.USAGE })}
              showToolbarItem={currentCategoryFilter === RHSM_API_QUERY_TYPES.USAGE}
            >
              <ToolbarFieldUsage viewId={viewId} />
            </ToolbarFilter>
          </ToolbarGroup>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </PfToolbar>
  );
};

/**
 * Prop types
 *
 * @type {{viewId: string, t: Function, activeFilters: Set, hardFilterReset: boolean, query: object,
 *     currentFilter: string, isDisabled: boolean, Array}}
 */
Toolbar.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.SLA]: PropTypes.string,
    [RHSM_API_QUERY_TYPES.USAGE]: PropTypes.string
  }),
  // chipGroupSequence: PropTypes.instanceOf(Set),
  // activeFilters: PropTypes.instanceOf(Set),
  // currentFilter: PropTypes.oneOf([RHSM_API_QUERY_TYPES.SLA, RHSM_API_QUERY_TYPES.USAGE]),
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOf([RHSM_API_QUERY_TYPES.SLA, RHSM_API_QUERY_TYPES.USAGE]),
      selected: PropTypes.bool
    })
  ),
  // hardFilterReset: PropTypes.bool,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, activeFilters: Set, hardFilterReset: boolean, query: object,
 *     currentFilter: string, isDisabled: boolean, filterOptions: Array}}
 */
Toolbar.defaultProps = {
  query: {},
  // activeFilters: new Set(),
  // chipGroupSequence: new Set(),
  // currentFilter: null,
  filterOptions: [
    {
      id: RHSM_API_QUERY_TYPES.SLA
    },
    {
      id: RHSM_API_QUERY_TYPES.USAGE,
      selected: true
    }
  ],
  // hardFilterReset: false,
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: translate,
  viewId: 'toolbar'
};

/**
 * Apply state to props.
 *
 * @param {object} state
 * @param {object} state.toolbar
 * @param {object} state.view
 * @param {object} props
 * @param {string} props.viewId
 * @returns {object}
 */
/*
const mapStateToProps = ({ toolbar, view }, { viewId }) => ({
  query: view?.query?.[viewId],
  ...toolbar.filters?.[viewId]
});

const ConnectedToolbar = connect(mapStateToProps)(Toolbar);

export { ConnectedToolbar as default, ConnectedToolbar, Toolbar };
 */
export { Toolbar as default, Toolbar };
