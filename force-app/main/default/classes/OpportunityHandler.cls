public with sharing class OpportunityHandler {
    public static void BeforeInsertOpportunities(List<Opportunity> OppsList){
        for(Opportunity opp: OppsList){
                if(opp.StageName == 'Closed Won'){
                opp.NextStep = 'Onboard a Contract';
                }
            }
    }
    public static void AfterInsertOpportunities(List<Opportunity> OppsList){
       List<Task> tasksToInsert = new List<Task>();
            for(Opportunity opp: OppsList){
                if(opp.StageName == 'Closed Won'){
                    Task engageWithCustomer = new Task();
                    engageWithCustomer.Subject = 'Engage with Customer';
                    engageWithCustomer.WhatId = opp.Id;
                    tasksToInsert.add(engageWithCustomer);

                    Task WelcomeCall = new Task();
                    WelcomeCall.Subject = 'Schedule a Welcome Email';
                    WelcomeCall.WhatId = opp.Id;
                    //WelcomeCall.WhoId = opp.OwnerId;
                    tasksToInsert.add(WelcomeCall);

                    Task ThankYouEmail = new Task();
                    ThankYouEmail.Subject = 'Send a Thank you Email';
                    ThankYouEmail.WhatId = opp.Id;
                    //ThankYouEmail.WhoId = opp.OwnerId;
                    tasksToInsert.add(ThankYouEmail);
                }
        }
        if(tasksToInsert.size() > 0){
            insert tasksToInsert;
        }
    }
}