@isTest
public class Test_Apex_Example2 {
    @isTest
    Static void TestMe(){
        Apex_Example2 ab = new Apex_Example2();
        ab.Option = 'Myself';        
        ab.callMe();
        system.assertEquals('Ashok', ab.Name);
        system.assertEquals('Bangalore', ab.City);
        ab.Option = 'GF';
        ab.callMe();
        system.assertEquals('Keerthi', ab.Name);
        system.assertEquals('Bangalore', ab.City);        
    }
}