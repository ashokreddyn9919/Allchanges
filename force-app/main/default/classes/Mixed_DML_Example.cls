public class Mixed_DML_Example {
    @future
    public static void callme(){
        Account acc = new Account();
        acc.Name='DML_Example'; 
        acc.Phone='0984214';
        acc.Industry='Energy';
        insert acc;
    }
    public void show(){
        profile p = [SELECT Id FROM Profile where Name='Test Profile'];
        UserRole r = [Select Id From UserRole Where Name='coo'];
        User u = new User(alias='mn', email='abc@dell.com',
                         emailencodingkey='UTF-8', lastname='abc',
                         languagelocalekey='en_US',
                         localesidKey='en_US', ProfileId = p.Id, UserRoleId = r.Id,
                         timezonesidKey='America/Los_Angeles',
                         username='ashok@dell.com');
        insert u;
    }
}