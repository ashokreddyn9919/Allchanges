public with sharing class accountlookup {
        @AuraEnabled(cacheable=true)
        public static List<Account> findAccount(String searchKey) {
            string key = '%' + searchKey + '%';
            List<Account> acctList = [SELECT Id, Name, AccountNumber, Type, Industry, AnnualRevenue FROM Account WHERE Name LIKE :key LIMIT 10];
            if(acctList.size()>0){
                return acctList;
            }
            return null;
        }
    
        @AuraEnabled(cacheable=true)
        public static List<Contact> getRelatedContact(string accountId) {
            List<Contact> conList = [SELECT Id, Name, Title, Email, Phone FROM Contact WHERE AccountId =: accountId];
            if(conList.size()>0){
                return conList;
            }
            return null;
        }
    
        @AuraEnabled(cacheable=true)
        public static List<Account> getCurrentAccount(string accountId) {
            List<Account> accList = [SELECT Id, Name, AccountNumber, Type, Industry, AnnualRevenue FROM Account WHERE Id =: accountId];
            if(accList.size()>0){
                return accList;
            }
            return null;
        }
    }