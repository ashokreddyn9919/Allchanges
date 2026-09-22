public class Queue_Example implements Queueable {
    
    public void execute(QueueableContext qc){
        List<Account> Acclist=[Select Id, Name from Account where CreatedDate=LAST_WEEK];
        delete Acclist;
        List<Opportunity> Opplist1=[SELECT Id,Name from Opportunity where CreatedDate=LAST_WEEK];
        for(Opportunity opp:Opplist1){
            opp.stageName='Closed Won';
        }
		update Opplist1;
        Queue_Example fe = new Queue_Example();
		Id jobId = system.enqueueJob(fe);
    }
}