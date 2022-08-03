import { devNavigationMenu } from '@console/dev-console/integration-tests/support/constants';
import {
  navigateTo,
  topologyPage,
  topologySidePane,
} from '@console/dev-console/integration-tests/support/pages';
import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('user has created additional builds', () => {
  const yamlFileName = `testData/builds/shipwrightAdditionalBuilds.yaml`;
  cy.exec(`oc create -n ${Cypress.env('NAMESPACE')} -f ${yamlFileName}`, {
    failOnNonZeroExit: false,
  }).then(function(result) {
    cy.log(result.stdout);
  });
});

Then('user should click on the workload {string}', (workload: string) => {
  cy.get('g.pf-topology__node__label > text')
    .click({ force: true })
    .wait(5000);
});

Then('user should see the topology sidebar visible', () => {
  topologySidePane.verify();
});

Then('user can verify the title of the sidebar with {string}', (workload: string) => {
  topologySidePane.verifyTitle(workload);
});

Then('user can verify selected tab is {string}', (tabName: string) => {
  topologySidePane.verifySelectedTab(tabName);
});

Then('user can verify {string} section is visible', (sectionName: string) => {
  topologySidePane.verifySection(sectionName);
});

When('user is at Topology page and see the workload {string}', (workload: string) => {
  navigateTo(devNavigationMenu.Topology);
  topologyPage.verifyWorkloadInTopologyPage(workload);
});

Then('user should see the topology sidebar visible along with the BuildRuns section', () => {
  topologySidePane.verify();
  topologySidePane.verifySection('BuildRuns');
});
