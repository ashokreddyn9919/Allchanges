public class Apex_Example3 {
    public String lastName;
    public String FirstName;
    public String LeadSource;
    
    public void show(){
        if(LeadSource == 'Web'){
            lastName = 'Kumar';
            firstName = 'Ashok';
        } else {
            lastName = 'Ashok';
           	firstName = 'Keerthi';            
        }
    }

}