public class Apex_Example5 {
    public void show(){
        List<Account> acc=[select Id, rating from Account];
        for(Account a:acc){
            a.rating='hot';
        }
        Update acc;
    }
    public void showme(){
        List<Account> Acc=[SELECT Id FROM Account WHERE Industry='Energy'];
        Delete acc;
    }
}