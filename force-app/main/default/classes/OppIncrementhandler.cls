public class OppIncrementhandler {
    
    public static void incrementOpp(list<Opportunity> Opps){
        
        set<id> ids=new set<id>();
        for(Opportunity Opp:Opps){
            ids.add(Opp.AccountId);
        }
        list<Account> a=[select Id,name,NumberOfOpportunities__c,Total_Opp_Amount__c,(Select Id,Name,amount,AccountId FROM Opportunities) FROM 
                         account WHERE id=:ids];
        double amount=0;
        for(account ac:a){
            ac.NumberOfOpportunities__c=ac.Opportunities.size();
			//amount+=ac.amount;
        }
        //a.Total_Opp_Amount__c = amount;
        update a;
    }

}