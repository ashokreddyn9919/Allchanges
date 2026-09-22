global class  StudentSOAPService
{
    webservice static Student__c getstudentById(String stdId){
       Student__c student=[Select Id, Student_Name__c,Phone_number__c,School__c, Email__c from Student__c where Id =:stdId];
       return student;
    }
}