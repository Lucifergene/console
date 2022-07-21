import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { impersonateStateToProps } from '@console/dynamic-plugin-sdk';
import { errorModal } from '@console/internal/components/modals';
import { useAccessReview } from '@console/internal/components/utils';
import { AccessReviewResourceAttributes } from '@console/internal/module/k8s';
import { startBuild } from '../../api';
import { BuildRunModel } from '../../models';
import { Build } from '../../types';

type StateProps = {
  impersonate?: {
    kind: string;
    name: string;
    subprotocols: string[];
  };
};

type StartBuildButtonProps = {
  build: Build;
  namespace: string;
};

const StartBuildButton: React.FC<StartBuildButtonProps & StateProps> = ({
  build,
  namespace,
  impersonate,
}) => {
  const { t } = useTranslation();
  const onClick = () => {
    startBuild(build).catch((err) => {
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
      <Button variant="secondary" onClick={onClick}>
        {t('shipwright-plugin~Start Build')}
      </Button>
    )
  );
};

export default connect(impersonateStateToProps)(StartBuildButton);
