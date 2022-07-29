import { Model } from '@patternfly/react-topology';
import { TopologyDataResources } from '@console/topology/src/topology-types';
import { getTopologyResourceObject } from '@console/topology/src/utils';
import { BUILDRUN_TO_RESOURCE_MAP_LABEL } from '../../const';

export const getShipwrightDataModelReconcilor = (
  model: Model,
  resources: TopologyDataResources,
): void => {
  if (!model || !model.nodes) {
    return;
  }

  model.nodes.forEach((node) => {
    const resource = getTopologyResourceObject(node.data);

    if (
      resources?.buildRuns?.data.find(
        (buildRun) =>
          buildRun.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL] ===
          resource?.metadata?.labels?.[BUILDRUN_TO_RESOURCE_MAP_LABEL],
      )
    ) {
      node.data.resources.builds = resources?.builds?.data;
      node.data.resources.buildRuns = resources?.buildRuns?.data;
    }
  });
};
