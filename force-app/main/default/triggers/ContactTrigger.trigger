trigger ContactTrigger on Contact (before insert, before update, after insert, after update) {
    /*Boolean Recursive =true;
if(Recursive){
Recursive = false;
list<account> acc=new list<Account>();
for(contact c:Trigger.new){
Account a=new account();
a.name = c.lastname;
a.Phone = c.Phone;
acc.add(a);
}
if(acc.size()>0){
insert acc;
}
}
    
    If(Trigger.isDelete){
        List<Id> ids=new List<id>();
        for(Contact c: trigger.new){
            ids.add(c.accountId);
        }
        List<Account> AllAcc=[Select Id,(SELECT Id from Contacts) from Account where Id=:Ids];
        
        for(Account a:AllAcc){
            if(a.Contacts.size()>2){
                a.adderror('You Can’t delete this Contact');
            }
        }
    }*/
    //mark duplicate contact if email or phone is repetedly enter for contact record
    if(trigger.isbefore){
        if(trigger.isinsert){
            set<string> emaildata = new set<string>();
            set<string> phonenumber = new set<string>();
            for(contact con : trigger.new){
                   	emaildata.add(string.valueof(con.Email));
                	phonenumber.add(string.valueof(con.phone));
                
            }
			 
            set<string> existingemaildata = new set<string>();
            set<string> existingphonenumber = new set<string>();
            for(contact con : [select id, email, phone from contact where email IN:emaildata or phone IN:phonenumber]){
                existingemaildata.add(string.valueof(con.Email));
                existingphonenumber.add(string.valueof(con.phone));
            }
            
            for(contact con : trigger.new){
                if(existingemaildata.size() > 0 && existingemaildata.contains(string.valueof(con.Email))){
                    con.Duplicate__c = true;
                } else if(existingphonenumber.size() > 0 && existingphonenumber.contains(string.valueof(con.phone))){
                    con.Duplicate__c = true;
                }
            }
        }
    }
    
    //when contact status is inactive reparenting to backup contact
    if(trigger.isAfter){
        if(trigger.isUpdate){
            set<id> ContactIds = new set<Id>();
            for(Contact con:Trigger.new){
                if(trigger.oldmap.get(con.Id).Status__c != con.Status__c && con.Status__c == 'Inactive'){
                    ContactIds.add(con.Id);
                }
            }
           List<case> updateCons=new List<case>();
           List<case> totalcases = [SELECT Id, ContactId, Contact.BackUpContact__c FROM case WHERE ContactId IN:ContactIds];
            for(case cs:totalcases){
                cs.ContactId = cs.Contact.BackUpContact__c;
                updateCons.add(cs);
            }
            if(updateCons.size()>0){
                Update updateCons;
            }
        }
    }
}