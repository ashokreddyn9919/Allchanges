global class Batch_Example1 Implements Database.Batchable<Sobject>{
    global database.QueryLocator start(Database.BatchableContext bc){
        //fetch all the accounts
        String query='Select Id, Name, ownership,type from Account';
        return database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext bc, List<Account> scope){
        for(Account a:scope){
            a.Ownership='Public';
            a.rating='Hot';
        }
        Update scope;
    }
    global void finish(Database.BatchableContext bc){
        AsyncApexJob jb=[SELECT Id, JobType, JobItemsProcessed, NumberOfErrors, TotalJobItems From AsyncApexJob WHERE Id=:bc.getJobId()];
        Messaging.SingleEmailMessage msg=new Messaging.SingleEmailMessage();
        String[] toadd=new String[]{'Ashok.n2399@gmail.com'};
            msg.setToAddresses(toadd);
        String body='Dear Admin,<br/> Batch operation with JobId:<br/>'+jb.Id;
        body=body+'</b><br/><br/> Processed Successfully <br/> Total JobItems:<b>'+jb.TotalJobItems;
        body=body+'</b><br/><br/> No of Errors:<b>'+jb.NumberOfErrors+'</b>';
        msg.setSubject('Batch Status');
        msg.setHtmlBody(body);
        Messaging.Email[] emails=new Messaging.Email[]{msg};
            Messaging.sendEmail(emails);
    }
}