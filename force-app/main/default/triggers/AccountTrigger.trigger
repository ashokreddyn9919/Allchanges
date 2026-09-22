trigger AccountTrigger on Account (before delete,after update) {
    
    /*
    //When a account field is updated related child primary contact billingstate should be updated
    if(trigger.isAfter){
        if(trigger.isupdate){
            map<Id,Account> accMap = new map<Id,Account>();
            for(Account acc:Trigger.new){
                if(acc.billingstate != trigger.oldmap.get(acc.Id).billingstate){
                    accMap.put(acc.id, acc);
                }                
            }
            list<Contact> contactstoupdate = new list<contact>();
            for(Contact con:[Select Id,AccountId,Account_State__c from Contact WHERE accountId IN:accMap.keyset() limit 49999]){
               con.Account_State__c = accMap.get(con.AccountId).billingstate;
               contactstoupdate.add(con);
            }
            if(!contactstoupdate.isEmpty()){
                update contactstoupdate;
        	}
        }
    }
    
    //When user is trying to delete account which is owned Account or any not closed case, shouldn't delete
    if(trigger.isbefore){
        if(trigger.isdelete){
            set<id> accIds=new set<id>();
            for(case cs:[select Id,AccountId,status from Case where AccountId IN:Trigger.oldmap.keyset() and status != 'closed']){
                accIds.add(cs.AccountId);
            }
            
            for(account acc:trigger.Old){
                if(acc.ownerId != userinfo.getuserId() || accIds.contains(acc.Id)){
                    acc.addError('You are not allowed to delete the record.');
                }
            }
        }
    } */
    
    //whenever Account Owner is updated same OwnerId should update into related opportunities
    if(trigger.isAfter){
        if(trigger.isupdate){
            set<id> accountids=new set<id>();
            for(account acc:trigger.new){
                if(acc.ownerId != trigger.oldmap.get(acc.Id).OwnerId){
                    accountids.add(acc.Id);
                }
            }
            
            list<opportunity> updateOpps=new list<opportunity>();
            for(opportunity ops:[SELECT Id, accountId, OwnerId FROM opportunity WHERE accountId IN:accountids]){
                ops.ownerId = trigger.newmap.get(ops.accountId).ownerId;
                updateOpps.add(ops);
            }
            
            if(updateOpps.size() >0)update updateOpps;
            
        }
    }
    
}