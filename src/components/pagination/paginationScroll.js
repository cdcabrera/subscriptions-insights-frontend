import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../loader/loader';
import { helpers } from '../../common';

/**
 * Scroll pagination.
 *
 * @augments React.Component
 * @fires onScroll
 */
class PaginationScroll extends React.Component {
  currentPage = 1;

  isLoading = false;

  /**
   * Update page state.
   *
   * @event onScroll
   * @param {object} event
   */
  onScroll = async event => {
    const { target } = event;
    const { currentPage } = this;
    const { onPage, distanceFromBottom } = this.props;
    const distanceBottom = target.scrollHeight - (target.scrollTop + target.clientHeight);

    if (distanceBottom < distanceFromBottom) {
      const page = currentPage + 1;
      this.isLoading = true;
      const results = await onPage({ page });

      if (results !== false) {
        this.currentPage = page;
      }

      this.isLoading = false;
    }
  };

  /**
   * Render default or custom loading.
   *
   * @returns {Node}
   */
  renderLoader() {
    const { isLoading } = this;
    const { loader } = this.props;

    if (isLoading) {
      return (
        (loader && <div className="curiosity-pagination-scroll-loader__custom">{loader}</div>) || (
          <div className="curiosity-pagination-scroll-loader__spinner">
            <Loader />
          </div>
        )
      );
    }

    return null;
  }

  /**
   * Render pagination.
   *
   * @returns {Node}
   */
  render() {
    const { children, elementHeight } = this.props;

    return (
      <div className="curiosity-pagination-scroll" style={{ height: `${elementHeight}px` }}>
        {this.renderLoader()}
        <div className="curiosity-pagination-scroll-list" onScroll={this.onScroll}>
          {children}
        </div>
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{distanceFromBottom: number, onPage: Function, children: Node, loader: Node, elementHeight: number}}
 */
PaginationScroll.propTypes = {
  children: PropTypes.node.isRequired,
  distanceFromBottom: PropTypes.number,
  elementHeight: PropTypes.number,
  loader: PropTypes.node,
  onPage: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{distanceFromBottom: number, onPage: Function, loader: null, elementHeight: number}}
 */
PaginationScroll.defaultProps = {
  distanceFromBottom: 10,
  elementHeight: 500,
  loader: null,
  onPage: helpers.noop
};

export { PaginationScroll as default, PaginationScroll };
