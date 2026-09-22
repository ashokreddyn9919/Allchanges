@RestResource(urlMapping='/studentsInfo/*')
global class StudentInformationService 
{
    global class StudentInfo
    {
        String studentName{get;set;}
        String studentAddress{get;set;}
        String studentPhone{get;set;}
        String SchoolName{get;set;}
    }
    
    @httpGet
    global static StudentInfo getStudent()
    {
        RestRequest request=RestContext.Request;
        String studentId=request.requestURI.substring(request.RequestURI.lastIndexof('/')+1);
        
        Student__c student=[SELECT Id,Address__c,Student_Name__c,Phone_Number__c,school__r.Name from Student__c where Id=:studentId];
        
        StudentInfo stdInfo = new StudentInfo();
        stdInfo.studentName=student.Student_Name__c;
        stdInfo.studentAddress=student.Address__c;
        stdInfo.studentPhone=student.Phone_number__c;
        stdInfo.SchoolName=student.school__r.Name;
        
        return stdInfo;
    }
}