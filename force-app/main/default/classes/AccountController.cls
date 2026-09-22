public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getRelatedAccounts(Id contactId) {
        // Fetch related accounts based on the Contact's current AccountId or logic
        Contact contact = [SELECT AccountId FROM Contact WHERE Id = :contactId LIMIT 1];
        List<Relational_Accounts__c> RelationalAcc = [Select id, name, Parent_Account__c, Parent_Account__r.Name from Relational_Accounts__c WHERE Parent_Account__c =:contact.AccountId];
        List<Id> AccountIds = new List<Id>();

        for(Relational_Accounts__c RA : RelationalAcc) {
            System.debug('RA Name: ' + RA.Parent_Account__c);
            AccountIds.add(RA.Parent_Account__c);
        }

        System.debug('AccountIds: ' + AccountIds);
        return [SELECT Id, Name 
                FROM Account 
                WHERE ParentId = :AccountIds OR Id = :AccountIds];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsBySearch(String searchKey) {
        return [
            SELECT Id, Name 
            FROM Account 
            WHERE Name LIKE :('%' + searchKey + '%') 
            LIMIT 10
        ];
    }
}