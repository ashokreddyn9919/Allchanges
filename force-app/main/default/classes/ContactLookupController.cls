public with sharing class ContactLookupController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsForAccount(Id accountId) {
        if (accountId == null) {
            return new List<Contact>();
        }
        return [SELECT Id, Name FROM Contact WHERE AccountId = :accountId LIMIT 100];
    }
}