@isTest
public class Test_Apex_Example4 {
    testmethod static void callme(){
        apex_Example4 ab = new apex_example4();
        ab.lastName = 'Reddy';
        ab.firstName = 'Ashok';
        ab.phone = '083-3894';
        ab.show();
        integer count = [Select count() from Contact where lastName=:ab.lastName and firstName=:ab.firstName];
        system.assertEquals(1, count);
    }
}