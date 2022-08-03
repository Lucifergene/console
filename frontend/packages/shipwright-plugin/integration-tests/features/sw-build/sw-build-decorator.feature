@shipwright

Feature: Shipwright Build Decorator
            As a user, I want to test whether the Build decorator is shown

        Background:
            # Given user has installed OpenShift Pipelines Operator
            Given user is at developer perspective
              And user has created or selected namespace "aut-shipwright-build"
            #   And user has installed Shipwright Operator
            #   And user is at Add page
              And user has created multiple shipwright builds
        
        @smoke
        Scenario: Topology page in dev perspective: SWB-02-TC01
            When user navigates to Topology in Developer perspective
            Then user should see the workload "sw-deployment-ko-build" visible
            And user should see the Build decorator attached to the deployment
            And user should be redirected to the buildRun logs page on clicking the decorator
            And user should be able to see the buildRun logs

            



    