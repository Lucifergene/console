import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { impersonateStateToProps } from '@console/dynamic-plugin-sdk';
import { errorModal } from '@console/internal/components/modals';
import { useAccessReview } from '@console/internal/components/utils';
import { AccessReviewResourceAttributes } from '@console/internal/module/k8s';
import { canRerunBuildRun, rerunBuildRun } from '../../api';
import { BuildRunModel } from '../../models';
import { BuildRun } from '../../types';
import { getLatestBuildRunStatus } from '../../utils';

type TriggerLastBuildButtonProps = {
  buildRuns: BuildRun[];
  namespace: string;
  impersonate?;
};

const TriggerLastBuildButton: React.FC<TriggerLastBuildButtonProps> = ({
  buildRuns,
  namespace,
  impersonate,
}) => {
  const { t } = useTranslation();
  const { latestBuildRun } = getLatestBuildRunStatus(buildRuns);

  const onClick = () => {
    rerunBuildRun(latestBuildRun).catch((err) => {
      const error = err.message;
      errorModal({ error });
    });
  };

  const defaultAccessReview: AccessReviewResourceAttributes = {
    group: BuildRunModel.apiGroup,
    resource: BuildRunModel.plural,
    namespace,
    verb: 'create',
  };
  const isAllowed = useAccessReview(defaultAccessReview, impersonate);

  return (
    isAllowed && (
      <Button variant="secondary" onClick={onClick} isDisabled={!canRerunBuildRun(latestBuildRun)}>
        {t('shipwright-plugin~Rerun latest BuildRun')}
      </Button>
    )
  );
};

export default connect(impersonateStateToProps)(TriggerLastBuildButton);
