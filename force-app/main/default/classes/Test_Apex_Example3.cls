@isTest
public class Test_Apex_Example3 {
	
    testmethod static void TestMe(){
        apex_Example3 ac = new apex_Example3();
        ac.LeadSource = 'web';
        ac.show();
        system.assertEquals('Ashok', ac.firstName);
        system.assertEquals('Kumar', ac.lastName);
        ac.LeadSource = 'c';
		ac.show();
        system.assertEquals('Keerthi', ac.firstName);
        system.assertEquals('Ashok', ac.lastName);
    }    
}