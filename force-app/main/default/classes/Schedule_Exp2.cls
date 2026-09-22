public class Schedule_Exp2 implements Schedulable {
    public void execute(SchedulableContext sc){
        List<Opportunity> opplist=[Select Id, Name, StageName from Opportunity where CreatedDate=THIS_MONTH];
        for(Opportunity op:opplist){ 
            op.StageName='closed won';
            op.Closedate =System.today();
        }
        Update opplist;
    }
}