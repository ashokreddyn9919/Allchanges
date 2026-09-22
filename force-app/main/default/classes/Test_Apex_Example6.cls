@isTest
Private class Test_Apex_Example6 {
	@testsetup static void testdat(){
        Opportunity op=new Opportunity();
        op.Name='test';
        Op.StageName ='Prospecting';
        op.CloseDate=System.Today()+15;
        insert op;
        Opportunity op1=new Opportunity();
        op1.Name='test';
        Op1.StageName ='Prospecting';
        op1.CloseDate=System.Today()+15;
        insert op1;
    }
    testmethod static void testm(){
        Apex_Example6 ab=new Apex_Example6();
        ab.callme();
        List<Opportunity> oplist=[Select id,StageName,CloseDate from Opportunity];
        for(Opportunity op:oplist){
            System.assertEquals('Closed Won', op.StageName);
            System.assertEquals(System.Today(), op.CloseDate);
        }
        integer Count=[select count() from Opportunity where Closedate=TODAY];
        system.debug('count' +Count);
        ab.show();
        integer Count1=[select count() from Opportunity where Closedate=TODAY];
        system.debug('count' +Count1);
        system.assertEquals(0, Count1);
    }
}