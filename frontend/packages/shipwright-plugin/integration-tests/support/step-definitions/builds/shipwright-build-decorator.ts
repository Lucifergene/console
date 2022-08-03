import { devNavigationMenu } from '@console/dev-console/integration-tests/support/constants';
import {
  app,
  navigateTo,
  topologyPage,
} from '@console/dev-console/integration-tests/support/pages';
import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { buildPO } from '../../pageObjects';

When('user has created multiple shipwright builds', () => {
  cy.exec(
    `oc apply -n ${Cypress.env('NAMESPACE')} -f testData/builds/shipwrightBuildStrategies.yaml`,
    {
      failOnNonZeroExit: false,
    },
  );

  const yamlFileName = `testData/builds/shipwrightBuildTest.yaml`;
  cy.exec(`oc create -n ${Cypress.env('NAMESPACE')} -f ${yamlFileName}`, {
    failOnNonZeroExit: false,
  }).then(function(result) {
    cy.log(result.stdout);
  });
});

When('user navigates to Topology in Developer perspective', () => {
  navigateTo(devNavigationMenu.Topology);
});

Then('user should see the workload {string} visible', (workload: string) => {
  topologyPage.verifyWorkloadInTopologyPage(workload);
});

Then('user should see the Build decorator attached to the deployment', (workload: string) => {
  cy.get(buildPO.decorator).should('be.visible');
});

Then('user should be redirected to the buildRun logs page on clicking the decorator', () => {
  cy.get(buildPO.decorator).click();
  cy.url().should('include', '/logs');
});

Then('user should be able to see the buildRun logs', () => {
  cy.get(buildPO.shipwrightBuild.buildrunLogs).should('be.visible');
});
