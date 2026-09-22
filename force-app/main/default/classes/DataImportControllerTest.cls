@isTest
public class DataImportControllerTest {
    static testMethod void importData_works() {
        Id jobId = DataImportController.importData();
        System.assertEquals(null, jobId);
    }

    static testMethod void importData_fails_when_job_is_running() {
        Test.startTest();
        executeBatchJob(new List<SolarBot_Status__c>());
        try {
            DataImportController.importData();
            System.assert(false, 'Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            System.assert(true, 'Expected an AuraHandledException');
        }
        Test.stopTest();
    }

    static testMethod void getImportJob() {
        Test.startTest();
        Id jobId = executeBatchJob(new List<SolarBot_Status__c>());
        Test.stopTest();
        
        AsyncApexJob job = DataImportController.getImportJob(jobId);
        
        System.assertEquals(jobId, job.Id);
    }

    static testMethod void getRunningImportJobId() {
        Test.startTest();
        Id jobId = executeBatchJob(new List<SolarBot_Status__c>());
        Id foundJobId = DataImportController.getRunningImportJobId();
        Test.stopTest();

        System.assertEquals(jobId, foundJobId);
    }

    public static Id executeBatchJob(List<SolarBot_Status__c> statuses) {
        BatchRecordCreator batchCreator = new BatchRecordCreator(statuses);
        return Database.executeBatch(batchCreator, 5000);
    }
}