public class ApexHoursFlowSeries {
    
    @InvocableMethod(label='Delete Related Opportunities'
                    description='Delete Related Opportunities for the given Record IDs.'
                    category='Account')
    //void replaced with List<String> when return is required
    public static void deleteOpportunities(List<String> Ids){
        //ids = {'0feiuwyewfb'}
        //Id AccountId = ids.get{0};
        List<Opportunity> oppList = [Select Id FROM Opportunity WHERE AccountId =: Ids and StageName = 'Closed Won'];
        Delete oppList;
        
        /*List<String> accountNames = new List<String>();
        List<Account> accounts = [Select Name From Account WHERE Id in: Ids];
        for(Account account : accounts){
            accountNames.add(account.Name);
        }
        return accountNames;*/
    }
    
    public static void sendEmail(){
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toaddresses = new String[] {'',''};
        message.subject = 'Opt Out Test Message';
        message.plaintextbody = 'This is the Message body';
        message.setSaveAsActivity(true);
        Messaging.SingleEmailMessage[] Messages = new List<Messaging.SingleEmailMessage>{message};
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        if(results[0].success){
            System.debug('The email was sent successfully.');
        } else {
            System.debug('The email failed to send:' +results[0].errors[0].message);
        }
    }

}