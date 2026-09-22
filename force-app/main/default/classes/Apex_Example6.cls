public class Apex_Example6 {
    public void callme(){
        List<Opportunity> opplist =[Select Id,StageName,CloseDate from Opportunity];
        for(Opportunity op:opplist){
            op.stageName='Closed Won';
            op.CloseDate=System.today();
        }
        Update opplist;
    }
    public void show(){
        List<Opportunity> optlist=[Select Id from Opportunity where closedate=TODAY];
        Delete optlist;
    }
}