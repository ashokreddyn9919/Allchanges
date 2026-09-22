public with sharing class GenerateOtpController {
    @AuraEnabled(cacheable=false)
    public static boolean sendOTP(Id recordId,string otp) {
    SObject record = SelectRecord.getRecord(recordId,'Email');
    string emailId = String.valueOf(record.get('Email'));
    if(string.isNotBlank(emailId))
    {
    
    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    
    String[] toAddresses = new String[] {emailId}; 
    system.debug('toAddresses>>'+toAddresses);
    mail.setToAddresses(toAddresses);
    mail.setSenderDisplayName('Salesforce Support');
    mail.setSubject('Verification Code');
    mail.setBccSender(false);
    mail.setUseSignature(true);
    // Specify the text content of the email.
    mail.setHtmlBody('Thanks for verifying your&nbsp;' + emailId + '&nbsp;account! <p>' + 
    '<b> Your code is:</b>' +OTP );
    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    return true;
    }
    return false;
    }
    }