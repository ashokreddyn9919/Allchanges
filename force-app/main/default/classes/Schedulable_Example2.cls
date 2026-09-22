public class Schedulable_Example2 Implements Schedulable{
    public void execute(SchedulableContext sc){
         List<Lead> leads = [SELECT Id,Email from Lead where createdDate=THIS_WEEK];
        List<String> emails = new List<String>();
            for(Lead ld:leads){
                emails.add(ld.Email);
            }
        	Messaging.SingleEmailMessage msg=new Messaging.SingleEmailMessage();        	           
            msg.setToAddresses(emails);
            msg.setSubject('Test Mail');
            String body='Dear Customer <br/> Update YOur contact details <br/> Thanks <br/>';
            body=body+'Sales Team';
            msg.setHtmlBody(body);
        	Messaging.Email[] allemails=new Messaging.Email[]{msg};
            messaging.sendEmail(allemails);
        }
}