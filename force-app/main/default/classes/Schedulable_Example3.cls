public class Schedulable_Example3 Implements Schedulable {
    public void execute(SchedulableContext sc){
        List<Contact> contactlist=[Select Id,Email from Contact where CreatedDate=LAST_WEEK];
        List<String> allEmails=new List<String>();
        for(Contact con:contactlist){
            allEmails.add(con.Email);
        }
        Messaging.SingleEmailMessage msg=new Messaging.SingleEmailMessage();
        msg.setToAddresses(allEmails);
        msg.setSubject('Test email');
        String body='Dear Customer <br/> Update your contact details <br/>Thanks<br/>';
        body=body+'Sales Team';
        msg.setHtmlBody(body);
        Messaging.Email[] myemails=new Messaging.Email[]{msg};
        messaging.sendEmail(myemails);        
    }
}