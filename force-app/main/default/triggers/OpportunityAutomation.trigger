trigger OpportunityAutomation on Opportunity (before insert, after insert, before update, after update) {
    switch on Trigger.OperationType {
        when BEFORE_INSERT, BEFORE_UPDATE{
            //list<Opportunity> opps = Trigger.new;
            //Opportunity opp = opps[0];

            OpportunityHandler.BeforeInsertOpportunities(Trigger.new);
        }

        when AFTER_INSERT, AFTER_UPDATE {

            //list<Opportunity> opps = Trigger.new;
            //Opportunity opp = opps[0];

            OpportunityHandler.AfterInsertOpportunities(Trigger.new);
            
    }
    }
}