trigger OpportunityTrigger on Opportunity (before insert, before update,before delete, after insert,after update,after delete,after undelete) {
    
    /*
    //Write a trigger to capture total number of Opportunities into parent account.
    if(trigger.isAfter){
         List<Id> accountIds=new List<Id>();
        if(trigger.isinsert || trigger.isundelete){
            for(Opportunity opp:Trigger.new){
                if(opp.AccountId != null){
                    accountIds.add(opp.AccountId);
                }
            }
        }
        if(trigger.isupdate){
            for(Opportunity opp:trigger.new){
                if(opp.accountId != null && trigger.oldmap.get(opp.id).accountId !=null){
                    accountIds.add(opp.accountId);
                    accountIds.add(trigger.oldmap.get(opp.id).accountId);
                }
            }
        }
        if(trigger.isdelete){
            for(Opportunity opp:Trigger.Old){
                if(opp.AccountId != null){
                    AccountIds.add(opp.AccountId);
                }
            }
        }
        Opportunityhandler Oppclass=new Opportunityhandler();
        Oppclass.countopportunities(AccountIds);
    }
    
    
    //When Opportunity adding with max amount compare to other Opportunities for same account, mark max amount checkbox is true in opportunity.
    if(trigger.isBefore){
        if(trigger.isinsert){
            set<Id> accIds=new set<Id>();
            map<id, opportunity> existingmaxopp=new map<id, opportunity>();
            for(Opportunity opp:trigger.new){
                if(opp.AccountId != null && opp.Amount != null){
                    accIds.add(opp.accountid);
                }
            }
            List<Opportunity> Opps=[SELECT Id,AccountId, max_Amount__c,amount from Opportunity where AccountId IN:accIds and max_Amount__c=true];
            for(Opportunity ops:Opps){
                existingmaxopp.put(ops.AccountId, ops);
            }
            
            list<Opportunity> updateopps=new list<Opportunity>();
            Opportunity OppOld;
            for(Opportunity allopps: trigger.new){
                if(existingmaxopp != null && existingmaxopp.keyset().contains(allopps.AccountId)){
                    if(existingmaxopp.get(allopps.AccountId).amount < allopps.Amount){
                        allopps.Max_Amount__c = true;
                        OppOld = existingmaxopp.get(allopps.AccountId);
                        OppOld.Max_Amount__c = false;
                        updateopps.add(OppOld);
                    }
                }
                else {
                    allopps.Max_Amount__c = true;
                }
            }
            if(updateopps.size()>0)update updateopps;
        }
        
        if(trigger.isupdate){
            set<Id> accIds=new set<Id>();
            map<id, opportunity> existingmaxopp=new map<id, opportunity>();
            for(Opportunity opp:trigger.new){
                if(opp.AccountId != null && opp.Amount != null){
                    accIds.add(opp.accountid);
                }
            }
            List<Opportunity> Opps=[SELECT Id,AccountId, max_Amount__c,amount from Opportunity where AccountId IN:accIds and max_Amount__c=true];
            for(Opportunity ops:Opps){
                existingmaxopp.put(ops.AccountId, ops);
            }
            
            list<Opportunity> updateopps=new list<Opportunity>();
            Opportunity OppOld;
            
            for(Opportunity allopps: trigger.new){
                if(allopps.Amount != trigger.oldmap.get(allopps.Id).amount){
                    if(existingmaxopp != null && existingmaxopp.keyset().contains(allopps.AccountId)){
                    if(existingmaxopp.get(allopps.AccountId).amount < allopps.Amount){
                        allopps.Max_Amount__c = true;
                        OppOld = existingmaxopp.get(allopps.AccountId);
                        OppOld.Max_Amount__c = false;
                        updateopps.add(OppOld);
                    }
                }
                else {
                    allopps.Max_Amount__c = true;
                }
              }
            }
            if(updateopps.size()>0)update updateopps;
        }
    } 
    */
    
    //when opportunity inserted ownerId should update with Account OwnerId in opportunity record
    if(trigger.isbefore){
        if(trigger.isinsert){
            set<id> accids=new set<id>();
            for(Opportunity op:trigger.new){
                if(op.AccountId !=null){
                    accids.add(op.AccountId);
                }
            }
            map<id,account> accmap = new map<id,account>([SELECT Id,ownerId from Account WHERE Id IN:accids]);
            for(Opportunity Opps:trigger.new){
                opps.OwnerId = accmap.get(Opps.AccountId).ownerId;
            }
        }
    }
}