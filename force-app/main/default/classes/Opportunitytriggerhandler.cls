public class Opportunitytriggerhandler {

    public void countnumber(List<id> accountIds){
        account acc;
        List<Account> acclist = new list<Account>();
        for(AggregateResult ars : [select count(Id)opp, AccountId from Opportunity where accountId IN: accountIds Group by AccountId]){
            acc = new Account();
            acc.id = (id)ars.get('AccountId');
            Acc.Total_Opportunities__c = (Decimal)ars.get('opp');
            accList.add(acc);
        }
        if(accList.Size()>0)update accList;
    }
}