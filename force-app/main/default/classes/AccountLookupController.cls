public with sharing class AccountLookupController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getRelatedAccounts(String criteriaField) {
        // Modify the WHERE clause to include your filter logic
        return [
            SELECT Id, Name 
            FROM Account
            WHERE Id = :criteriaField 
            ORDER BY Name
            LIMIT 50
        ];
    }
}