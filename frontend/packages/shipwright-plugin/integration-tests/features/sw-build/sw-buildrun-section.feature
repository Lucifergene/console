@shipwright

Feature: Shipwright BuildRun Section
            As a user, I want to test whether the BuildRun Tab Section is visible

        Background:
            # Given user has installed OpenShift Pipelines Operator
            Given user is at developer perspective
              And user has created or selected namespace "aut-shipwright-build"
            #   And user has installed Shipwright Operator
            #   And user is at Add page
              And user has created multiple shipwright builds
              And user has created additional builds
            
        @smoke
        Scenario: BuildRun Section in Topology Sidebar: SWB-03-TC01
            When user navigates to Topology in Developer perspective
            Then user should see the workload "sw-deployment-ko-build" visible
            And user should click on the workload "sw-deployment-ko-build"
            Then user should see the topology sidebar visible
            And user can verify the title of the sidebar with "sw-deployment-ko-build"
            And user can verify selected tab is "Resources"
            And user can verify "BuildRuns" section is visible


        @smoke
        Scenario: See the BuildRuns from the Topology Sidebar: SWB-03-TC02
            When user is at Topology page and see the workload "sw-deployment-ko-build"
            Then user should click on the workload "sw-deployment-ko-build"
            And user should see the topology sidebar visible along with the BuildRuns section
            And user can verify the buildRun corresponding to the Build
            And user can go to the buildRun page on clicking the buildRun name
            And user can go to the logs of the buildRun on clicking the View logs link
        
        
        @smoke
        Scenario: Start and Trigger BuildRun from Topology Sidebar: SWB-03-TC03
            When user is at Topology page and see the workload "sw-deployment-ko-build"
            Then user should click on the workload "sw-deployment-ko-build"
            And user should see the topology sidebar visible along with the BuildRuns section
            And user can verify the buildRun corresponding to the Build
            And user can start a buildRun on clicking the Start BuildRun button
            And user can trigger a last buildRun on clicking the Trigger Latest BuildRun button

