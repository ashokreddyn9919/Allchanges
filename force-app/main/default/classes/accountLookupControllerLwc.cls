public with sharing class accountLookupControllerLwc {
    public accountLookupControllerLwc(){

    }    
    //Account Search method
    @AuraEnabled(cacheable=true)
    public static List<account> getAccounts(String accName) {
        System.debug('records' +accName);
        String KeyString = '%'+accName+'%';        
        return [select Id, Name, AccountNumber, Type, AnnualRevenue, Industry from Account where Name like:KeyString];
    }
}