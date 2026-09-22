public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByOwnerPress() {
        Id userId = UserInfo.getUserId();
        system.debug('userId' +userId);
        return [
            SELECT Id, FirstName, LastName, Email, Phone, Account.Name, CreatedDate, AccountId 
            FROM Contact 
            WHERE OwnerId = :userId];

    }
}