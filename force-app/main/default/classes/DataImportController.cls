public with sharing class DataImportController {
    @AuraEnabled
    public static Id importData() {
        try {
            DataFactory dataFactory = new DataFactory();
            return dataFactory.generateData();
        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException('Sample data import failed. Check logs for errors.');
        }
    }

    @AuraEnabled
    public static AsyncApexJob getImportJob(Id jobId) {
        return [SELECT Id, Status, JobItemsProcessed, TotalJobItems, NumberOfErrors FROM AsyncApexJob WHERE ID =: jobId ];
    }

    @AuraEnabled
    public static Id getRunningImportJobId() {
        return BatchRecordCreator.getRunningJobId();
    }
}