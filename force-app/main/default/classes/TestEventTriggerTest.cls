@IsTest
public class TestEventTriggerTest{
    
    @isTest
    public static void publishEvent(){
        Test_Event__e event = new Test_Event__e(Name__c = 'Name__c', Account_Id__c = 'Account_Id__c');
        
        EventBus.publish(event);
    }
}