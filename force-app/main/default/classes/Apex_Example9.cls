public class Apex_Example9 {
    public void callMe(){
        list<User> u=[Select Id from User where alias='akuma'];
        List<opportunity> oplist=[select id,StageName from Opportunity WHERE OwnerId=:u[1].id];
        for(Opportunity op:oplist){
            op.StageName='Closed Won';
            op.CloseDate=System.today();
        }
        update oplist;
    }
    public  void show(){
        list<User> u=[select id from user where alias='akuma'];
        List<Opportunity> opplist=[Select Id,StageName from Opportunity where ownerId=:u[1].Id];
        delete opplist;
    }
}