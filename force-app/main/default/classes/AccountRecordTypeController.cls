public with sharing class AccountRecordTypeController {
    @AuraEnabled(cacheable=true)
    public static List<RecordTypeWrapper> getAccountRecordTypes() {
        List<RecordTypeWrapper> result = new List<RecordTypeWrapper>();

        for (RecordType rt : [
            SELECT Id, Name, DeveloperName, Description
            FROM RecordType
            WHERE SObjectType = 'Account' AND IsActive = true
            ORDER BY Name
        ]) {
            result.add(new RecordTypeWrapper(rt.Id, rt.Name, rt.DeveloperName, rt.Description));
        }
        return result;
    }

    public class RecordTypeWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String name;
        @AuraEnabled public String developerName;
        @AuraEnabled public String description;

        public RecordTypeWrapper(String id, String name, String developerName, String description) {
            this.id = id;
            this.name = name;
            this.developerName = developerName;
            this.description = description;
        }
    }
}