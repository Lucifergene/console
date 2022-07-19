import { Model } from '@patternfly/react-topology';
import { TopologyDataResources } from '@console/topology/src/topology-types';
import { getTopologyResourceObject } from '@console/topology/src/utils';

export const getShipwrightDataModelReconcilor = (
  model: Model,
  resources: TopologyDataResources,
): void => {
  if (!model || !model.nodes) {
    return;
  }

  model.nodes.forEach((node) => {
    const resource = getTopologyResourceObject(node.data);

    const controllerName = resource?.spec?.template?.spec?.containers[0]?.env.find(
      (env) => env?.name === 'CONTROLLER_NAME',
    );

    if (
      controllerName?.value &&
      resource?.spec?.selector?.matchLabels?.name === controllerName?.value
    ) {
      node.data.resources.builds = resources?.builds?.data;
      node.data.resources.buildRuns = resources?.buildRuns?.data;
    }
  });
};
