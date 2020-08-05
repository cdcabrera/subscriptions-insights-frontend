import React from 'react';
import PropTypes from 'prop-types';
// import { withTranslation } from 'react-i18next';
import { Pagination as PfPagination } from '@patternfly/react-core';
import { reduxTypes, store } from '../../redux';
import {rhsmApiTypes} from '../../types/rhsmApiTypes';
// import { helpers } from '../../common';

/**
 * Contained pagination.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onPage
 * @fires onPerPage
 */
class Pagination extends React.Component {
  /**
   * Update page state.
   *
   * @event onPage
   * @param {object} event
   * @param {number} page
   */
  onPage = (event, page) => {
    // const { perPage, viewId } = this.props;
    const { graphQuery, viewId } = this.props;
    // const offset = graphQuery[rhsmApiTypes.RHSM_API_QUERY_OFFSET] * (page - 1);
    // const offset = graphQuery[rhsmApiTypes.RHSM_API_QUERY_OFFSET] * page || 0;
    const offset = graphQuery[rhsmApiTypes.RHSM_API_QUERY_LIMIT] * page || 0;

    console.log('offset >>>', offset, graphQuery[rhsmApiTypes.RHSM_API_QUERY_LIMIT], page);

    store.dispatch({
      type: reduxTypes.rhsm.SET_OFFSET_RHSM,
      viewId,
      page,
      [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: offset
      // [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: perPage * (page - 1)
    });
  };

  /**
   * Update per-page state.
   *
   * @event onPerPage
   * @param {object} event
   * @param {number} perPage
   */
  onPerPage = (event, perPage) => {
    const { viewId } = this.props;

    store.dispatch({
      type: reduxTypes.rhsm.SET_LIMIT_RHSM,
      viewId,
      perPage,
      [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: perPage
    });
  };

  setPerPage() {
    // const {} = this.state;
  }

  /**
   * Render pagination.
   *
   * @returns {Node}
   */
  render() {
    // const { graphQuery, isCompact, itemCount, page, perPage, variant } = this.props;
    // const updatedPage =   || page;
    // const updatedPerPage = graphQuery[rhsmApiTypes.RHSM_API_QUERY_LIMIT] || perPage;
    const { graphQuery, isCompact, itemCount, variant } = this.props;
    // const page = (itemCount / graphQuery[rhsmApiTypes.RHSM_API_QUERY_OFFSET]) || 0;
    // const page = Math.ceil(itemCount / graphQuery[rhsmApiTypes.RHSM_API_QUERY_LIMIT]) || 0;
    const page = Math.ceil(graphQuery[rhsmApiTypes.RHSM_API_QUERY_OFFSET] / graphQuery[rhsmApiTypes.RHSM_API_QUERY_LIMIT]) || 0;
    const updatedPerPage = graphQuery[rhsmApiTypes.RHSM_API_QUERY_LIMIT];

    return (
      <PfPagination
        isCompact={isCompact}
        itemCount={itemCount}
        page={page}
        perPage={updatedPerPage || 10}
        onSetPage={this.onPage}
        onPerPageSelect={this.onPerPage}
        variant={variant}
      />
    );
  }
}

/**
 * Prop types
 *
 * @type {{}}
 */
Pagination.propTypes = {
  graphQuery: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: PropTypes.number,
    [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: PropTypes.number
  }),
  isCompact: PropTypes.bool,
  itemCount: PropTypes.number,
  // page: PropTypes.number,
  perPage: PropTypes.number,
  variant: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{}}
 */
Pagination.defaultProps = {
  graphQuery: {},
  isCompact: true,
  itemCount: 10,
  // page: 1,
  perPage: 10,
  variant: null,
  viewId: 'pagination'
};

// const ConnectedPagination = ;

// export { ConnectedPagination as default, ConnectedPagination, Pagination };
export { Pagination as default, Pagination };
