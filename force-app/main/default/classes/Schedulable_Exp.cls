public class Schedulable_Exp Implements Schedulable{
    public void execute(SchedulableContext sc){
        List<Account> acc=[Select Id,Name from Account where CreatedDate=LAST_N_Days:10];
        Delete acc;
    }
}