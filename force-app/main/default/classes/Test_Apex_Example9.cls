@isTest
private class Test_Apex_Example9 {
	@testsetup
    static void testdata(){
        List<User> u=[select id from user where alias='akuma'];
		Opportunity op=new Opportunity();
        op.Name='testing';
        op.StageName='Prospecting';
        op.CloseDate=System.today()+10;
        op.OwnerId=u[1].Id;
        insert op;
        }
    testmethod static void test1(){
        Apex_Example9 ab=new Apex_Example9();
        ab.callMe();
        List<User> u=[Select id from User Where alias='akuma'];
        List<Opportunity> oplist=[select Id,StageName from Opportunity where ownerId=:u[1].Id];
        for(Opportunity op:oplist){
            system.assertEquals('Closed Won',op.StageName);
            system.assertEquals(System.today(), op.CloseDate);
        }
    }
    testmethod static void test2(){
        Apex_Example9 abc=new Apex_Example9();
        abc.show();
        List<User> u=[Select id from User Where alias='akuma'];
        List<Opportunity>  count=[select Id,StageName from Opportunity where ownerId=:u[1].Id];
        for(Opportunity op:count){
            system.assertEquals(true, op.IsDeleted);
        }        
    }
}