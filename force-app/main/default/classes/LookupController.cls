public with sharing class LookupController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchTerm) {
        return [SELECT Id, Name FROM Account WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }
}