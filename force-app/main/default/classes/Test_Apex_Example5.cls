@isTest
Private class Test_Apex_Example5 {
    @testSetup static void create(){
        Account acc=new Account();
        acc.Name='test';
        acc.Phone='098-986';
        acc.Industry='Energy';
        insert acc;
    }    
    testmethod static void testme(){        
        Apex_Example5 abc=new Apex_Example5();
        abc.show();
        Account a=[SELECT Id FROM Account];
        System.assertEquals('Hot', a.rating);
    }
    testmethod static void testdeleteme(){        
        Apex_Example5 abc=new Apex_Example5();
        abc.showme();
        integer a=[SELECT Count() from account where industry=:'Energy'];
        System.assertEquals(0, a);
    }
}