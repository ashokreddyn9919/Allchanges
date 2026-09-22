public with sharing class OppLookupController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getFilteredContacts(String accountId) {
        return [
            SELECT Id, Name, Email, Title
            FROM Contact
            WHERE AccountId =:accountId
            LIMIT 50 ];
    }
}