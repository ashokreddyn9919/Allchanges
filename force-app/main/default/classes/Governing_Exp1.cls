public class Governing_Exp1 {
    public void soqlexp(){
        for(integer i=1;i<=102;i++){
            List<Account> acc=[select Id from Account];
        }
    }
    public void dmlexp(){
        for(Integer i=1;i<=155;i++){
            account acc = new Account();
            acc.Name='DML'+i;
            insert acc;
        }
    }
    public void dmlrows(){
        List<Account> Accounts=new List<account>();
        for(integer i=1;i<=10003;i++){
            Account acc=new Account();
            acc.Name='DML'+i;
            Accounts.add(acc);
        }
        insert accounts;
    }
}