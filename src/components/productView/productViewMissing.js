/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter, CardTitle, Gallery, Title, PageSection } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { Redirect, routerHelpers } from '../router/router';
import { reduxActions, useDispatch } from '../../redux';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Render a missing product view.
 *
 * @fires onNavigate
 * @param {object} props
 * @param {number} props.availableProductsRedirect
 * @param {Function} props.t
 * @returns {Node}
 */
const ProductViewMissing = ({ availableProductsRedirect, t }) => {
  const dispatch = useDispatch();

  /**
   * Return a list of available products.
   *
   * @returns {Array}
   */
  const filterAvailableProducts = () => {
    const { configs, allConfigs } = routerHelpers.getRouteConfigByPath();
    return (configs.length && configs) || allConfigs.filter(({ isSearchable }) => isSearchable === true);
  };

  /**
   * On click, update history.
   *
   * @event onNavigate
   * @param {string} id
   * @returns {void}
   */
  const onNavigate = id => {
    if (helpers.DEV_MODE) {
      const { routeHref } = routerHelpers.getRouteConfig({ id });
      window.location.href = routeHref;
    } else {
      dispatch(reduxActions.platform.setAppNav(id));
    }
  };

  const availableProducts = filterAvailableProducts();

  if (!helpers.DEV_MODE && availableProducts.length <= availableProductsRedirect) {
    dispatch(reduxActions.platform.setAppNav(availableProducts[0].id));
    return null;
  }

  /*
  if (availableProducts.length <= availableProductsRedirect) {
    return <Redirect isForced route={availableProducts[0].path} />;
  }
   */

  return (
    <PageLayout className="curiosity-missing-view">
      <PageHeader productLabel="missing" includeTour>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME })}
      </PageHeader>
      <PageSection isFilled>
        <Gallery hasGutter>
          {availableProducts.map(product => (
            <Card key={`missingViewCard-${product.id}`} isHoverable onClick={() => onNavigate(product.id)}>
              <CardTitle>
                <Title headingLevel="h2" size="lg">
                  {t('curiosity-view.title', {
                    appName: helpers.UI_DISPLAY_NAME,
                    context:
                      (Array.isArray(product.pathParameter) && product.pathParameter?.[0]) || product.pathParameter
                  })}
                </Title>
              </CardTitle>
              <CardBody className="curiosity-missing-view__card-description">
                {t('curiosity-view.description', {
                  appName: helpers.UI_DISPLAY_NAME,
                  context:
                    (Array.isArray(product.productParameter) && product.productParameter?.[0]) ||
                    product.productParameter
                })}
              </CardBody>
              <CardFooter>
                <Button
                  variant="link"
                  isInline
                  onClick={() => onNavigate(product.id)}
                  icon={<ArrowRightIcon />}
                  iconPosition="right"
                >
                  Open
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{numberProductsRedirect: number, t: Function}}
 */
ProductViewMissing.propTypes = {
  availableProductsRedirect: PropTypes.number,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{availableProductsRedirect: number, t: translate}}
 */
ProductViewMissing.defaultProps = {
  availableProductsRedirect: 3,
  t: translate
};

export { ProductViewMissing as default, ProductViewMissing };
