@isTest
public class Test_Apex_Example1 {
    
    @isTest
    static void testMe(){
        Apex_Example1 ab = New Apex_Example1();
        ab.callMe();
        system.assertEquals('Ashok', ab.Name);
        system.assertEquals('Anantapur', ab.City);
    }
}