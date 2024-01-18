import React from 'react';
import PropTypes from 'prop-types';
import {
  Brand,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  FlexItem,
  Form,
  ActionGroup,
  Spinner,
  Title
} from '@patternfly/react-core';
import { useSession } from '../authentication/authenticationContext';
import { storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';
import { PageLayout } from '../pageLayout/pageLayout';
import { helpers } from '../../common';
import graphPng2x from '../../images/graph2x.png';
import graphPng4x from '../../images/graph4x.png';
import { userTypes } from '../../redux/types';
import { userServices } from '../../services/user/userServices';

/**
 * Opt-in view
 *
 * @memberof Components
 * @module OptinView
 */

/**
 * An account opt-in view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.updateAccountOptIn
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelectorsResponse
 * @param {Function} props.useSession
 * @fires onSubmitOptIn
 * @returns {React.ReactNode}
 */
const OptinView = ({
  t,
  updateAccountOptIn,
  useDispatch: useAliasDispatch,
  useSelectorsResponse: useAliasSelectorsResponse,
  useSession: useAliasSession
}) => {
  const dispatch = useAliasDispatch();
  const { errorStatus } = useAliasSession();
  const { error, fulfilled, pending } = useAliasSelectorsResponse(userTypes.UPDATE_USER_OPTIN);

  /**
   * Submit and update account opt-in.
   *
   * @event onSubmitOptIn
   * @returns {void}
   */
  const onSubmitOptIn = () =>
    dispatch({
      dynamicType: userTypes.UPDATE_USER_OPTIN,
      payload: updateAccountOptIn(),
      meta: {
        notifications: {
          rejected: {
            variant: 'danger',
            title: translate('curiosity-optin.notificationsErrorTitle', { appName: helpers.UI_DISPLAY_NAME }),
            description: translate('curiosity-optin.notificationsErrorDescription'),
            dismissable: true
          },
          fulfilled: {
            variant: 'success',
            title: translate('curiosity-optin.notificationsSuccessTitle', { appName: helpers.UI_DISPLAY_NAME }),
            description: translate('curiosity-optin.notificationsSuccessDescription'),
            dismissable: true,
            autoDismiss: false
          }
        }
      }
    });

  /**
   * Render opt-in form states.
   *
   * @returns {React.ReactNode}
   */
  const renderOptinForm = () => {
    const disableButton = errorStatus !== 403;

    if (pending) {
      return (
        <Form>
          <ActionGroup>
            <Button variant="primary" isDisabled>
              <Spinner size="sm" /> {t('curiosity-optin.buttonActivate', { appName: helpers.UI_DISPLAY_NAME })}
            </Button>
          </ActionGroup>
        </Form>
      );
    }

    if (error) {
      return (
        <p>
          {t('curiosity-optin.cardIsErrorDescription', { appName: helpers.UI_DISPLAY_NAME }, [
            <Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_CONTACT_US} />
          ])}
        </p>
      );
    }

    if (disableButton || fulfilled) {
      return (
        <Form>
          <ActionGroup>
            <Button data-test="optinButtonSubmitDisabled" variant="primary" isDisabled>
              {t('curiosity-optin.buttonIsActive', { appName: helpers.UI_DISPLAY_NAME })}
            </Button>
          </ActionGroup>
          {fulfilled && <p>{t('curiosity-optin.cardIsActiveDescription')}</p>}
        </Form>
      );
    }

    return (
      <Form>
        <ActionGroup>
          <Button data-test="optinButtonSubmit" variant="primary" onClick={onSubmitOptIn}>
            {t('curiosity-optin.buttonActivate', { appName: helpers.UI_DISPLAY_NAME })}
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  /**
   * Render tour copy and button.
   *
   * @returns {React.ReactNode}
   */
  const renderTour = () => (
    <Card className="curiosity-optin-tour">
      <CardHeader
        actions={{
          actions: (
            <Brand
              srcSet={`${graphPng4x} 1064w, ${graphPng2x} 600w`}
              src={graphPng4x}
              alt={t('curiosity-optin.tourTitleImageAlt')}
              aria-hidden
              className="curiosity-optin-image"
            />
          )
        }}
      />
      <CardTitle>
        <Title headingLevel="h3" size="2xl">
          {t('curiosity-optin.tourTitle')}
        </Title>
      </CardTitle>
      <CardBody>{t('curiosity-optin.tourDescription')}</CardBody>
      <CardFooter>
        <Button data-test="optinButtonTour" variant="secondary" className="uxui-curiosity__button-tour">
          {t('curiosity-optin.buttonTour')}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <PageLayout>
      <Card data-test="optinView">
        <Flex>
          <Flex flex={{ default: 'flex_2' }}>
            <FlexItem>
              <CardTitle key="heading1Title">
                <Title headingLevel="h1" size="2xl">
                  {t('curiosity-optin.cardTitle', { appName: helpers.UI_DISPLAY_NAME })}
                </Title>
              </CardTitle>
              <CardBody key="heading1Desc">
                {t('curiosity-optin.cardDescription', { appName: helpers.UI_DISPLAY_NAME })}
              </CardBody>

              <CardTitle key="heading2Title">
                <Title headingLevel="h2" size="xl">
                  {t('curiosity-optin.cardSeeTitle')}
                </Title>
              </CardTitle>
              <CardBody key="heading2Desc">{t('curiosity-optin.cardSeeDescription')}</CardBody>

              <CardTitle key="heading3Title">
                <Title headingLevel="h2" size="xl">
                  {t('curiosity-optin.cardReportTitle')}
                </Title>
              </CardTitle>
              <CardBody key="heading3Desc">{t('curiosity-optin.cardReportDescription')}</CardBody>

              <CardTitle key="heading4Title">
                <Title headingLevel="h2" size="xl">
                  {t('curiosity-optin.cardFilterTitle')}
                </Title>
              </CardTitle>
              <CardBody key="heading4Desc">{t('curiosity-optin.cardFilterDescription')}</CardBody>

              <CardFooter>{renderOptinForm()}</CardFooter>
            </FlexItem>
          </Flex>
          <Flex flex={{ default: 'flex_1' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem>
              <CardBody>{renderTour()}</CardBody>
            </FlexItem>
          </Flex>
        </Flex>
      </Card>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{useSession: Function, t: Function, updateAccountOptIn: Function, useDispatch: Function,
 *     useSelectorsResponse: Function}}
 */
OptinView.propTypes = {
  t: PropTypes.func,
  updateAccountOptIn: PropTypes.func,
  useDispatch: PropTypes.func,
  useSelectorsResponse: PropTypes.func,
  useSession: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useSession: Function, t: Function, updateAccountOptIn: Function, useDispatch: Function,
 *     useSelectorsResponse: Function}}
 */
OptinView.defaultProps = {
  t: translate,
  updateAccountOptIn: userServices.updateAccountOptIn,
  useDispatch: storeHooks.reactRedux.useDynamicDispatch,
  useSelectorsResponse: storeHooks.reactRedux.useDynamicSelectorsResponse,
  useSession
};

export { OptinView as default, OptinView };
