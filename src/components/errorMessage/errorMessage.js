import React, { useState } from 'react';
import {
  Button,
  ClipboardCopy,
  ClipboardCopyButton,
  ClipboardCopyVariant,
  clipboardCopyFunc,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { ExportIcon, CogIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { helpers, downloadHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Error message component wrapper.
 *
 * @memberof Components
 * @module ErrorMessage
 */

/**
 * Display 4xx and 5xx related error messages.
 *
 * @param {object} props
 * @param {string|Error} [props.message]
 * @param {string} [props.description]
 * @param {string} [props.title]
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const ErrorMessage = ({ message, description, title, t = translate }) => {
  const [isErrorDisplay, setIsErrorDisplay] = useState(false);
  const [hasScrolled, setHasScrolled] = useState([]);
  const errorStr = (typeof message === 'string' && message) || message?.message;
  const cause = message?.cause && (
    <textarea
      className="curiosity-error__textarea"
      onScroll={event => {
        const target = event.currentTarget;
        if (target.scrollTop >= target.scrollHeight - target.offsetHeight && !hasScrolled) {
          setHasScrolled(true);
        }
      }}
      readOnly
      rows="10"
      value={JSON.stringify([message.cause], null, 2)}
    />
  );
  const isCauseOrError = (cause || errorStr) && true;

  const onErrorDisplay = () => {
    setHasScrolled(false);
    setIsErrorDisplay(!isErrorDisplay);
  };

  const onDownloadLog = () => downloadHelpers.debugLog();

  return (
    <div className="fadein" aria-live="polite">
      {isCauseOrError && (
        <Button
          className="curiosity-error__link"
          title={t('curiosity-view.error', { context: 'debug' })}
          style={{ float: 'right' }}
          variant="link"
          onClick={() => onErrorDisplay()}
        >
          <CogIcon />
          <span className="sr-only">{t('curiosity-view.error', { context: 'debug' })}</span>
        </Button>
      )}
      {hasScrolled && isErrorDisplay && isCauseOrError && (
        <Button
          className="curiosity-error__link fadein"
          variant="link"
          onClick={() => onDownloadLog()}
          icon={<ExportIcon />}
        >
          {t('curiosity-view.error', { context: 'download' })}
        </Button>
      )}
      {(isErrorDisplay && (cause || errorStr)) || (
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={ExclamationCircleIcon} />
          <Title headingLevel="h2" size="lg">
            {title || t('curiosity-view.error', { context: 'title', appName: helpers.UI_INTERNAL_NAME })}
          </Title>
          <EmptyStateBody>
            {description ||
              t('curiosity-view.error', { context: 'description' }, [
                <Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_PLATFORM_STATUS} />
              ])}
          </EmptyStateBody>
        </EmptyState>
      )}
    </div>
  );
};

export { ErrorMessage as default, ErrorMessage };
