public with sharing class EPH_AccountRecordTypeController {
    public class RecordTypeWrapper {
        @AuraEnabled public String recordTypeId;
        @AuraEnabled public String name;
        @AuraEnabled public String developerName;
        @AuraEnabled public String description;

        public RecordTypeWrapper(String recordTypeId, String name, String developerName, String description) {
            this.recordTypeId = recordTypeId;
            this.name = name;
            this.developerName = developerName;
            this.description = description;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<RecordTypeWrapper> getAccountRecordTypes() {
        List<RecordTypeWrapper> results = new List<RecordTypeWrapper>();

        for (RecordType rt : [
            SELECT Id, Name, DeveloperName, Description
            FROM RecordType
            WHERE SObjectType = 'Account'
            AND IsActive = true
            ORDER BY Name
        ]) {
            results.add(new RecordTypeWrapper(
                rt.Id,
                rt.Name,
                rt.DeveloperName,
                rt.Description
            ));
        }

        return results;
    }
}