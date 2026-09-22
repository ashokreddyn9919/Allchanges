global class BatchRecordCreator implements Database.Batchable<sObject> {
    private final List<SObject> allRecords;
    
    global BatchRecordCreator(List<SObject> records) {
        this.allRecords = records;
    }

    global Iterable<sObject> start(Database.BatchableContext context) {
        return allRecords;
    }

    global void execute(Database.BatchableContext context, List<sObject> batchRecords) {
        insert batchRecords;
    }

    global void finish(Database.BatchableContext context) {
        // Check for errors and send an email if batch failed
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems, CreatedBy.Email FROM AsyncApexJob WHERE Id = :context.getJobId()];
        if (job.NumberOfErrors > 0) {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {job.CreatedBy.Email});
            email.setSubject('Admin Superbadge sample data generation ' + job.Status);
            email.setPlainTextBody(
                'The batch Apex job in charge of generating the sample data for the Admin Superbadge failed.\n'+
                'It processed ' + job.TotalJobItems +' batches with '+ job.NumberOfErrors + ' failures.\n\n'+
                'Please check for errors and reinstall the package.'
            );
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        }
    }

    global static Id getRunningJobId() {
        String batchClassName = BatchRecordCreator.class.getName();
        Id batchClassId = [SELECT Id FROM ApexClass WHERE Name =: batchClassName].Id;
        List<AsyncApexJob> jobs = [SELECT Id FROM AsyncApexJob WHERE Status NOT IN ('Aborted', 'Completed', 'Failed') AND ApexClassId =: batchClassId];
        if (jobs.size() == 0) {
            return null;
        }
        return jobs[0].Id;
    }
}