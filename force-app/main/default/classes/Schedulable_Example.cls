public class Schedulable_Example implements Schedulable{
    public void execute(SchedulableContext sc){
        List<Opportunity> optlist = [SELECT Id,stagename, closedate from Opportunity Where createdDate=TODAY];
        for(Opportunity op:optlist){
            op.stagename = 'Prospecting';
            op.closedate =System.today()+15;
        }
		update optlist;
    }
}