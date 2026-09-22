public class Apex_Example4 {
	public String lastName;
    public String firstName;
    public String phone;
    public void show(){
        contact con = new contact();
        con.LastName=lastName;
        con.FirstName=firstName;
        con.Phone=phone;
        insert con;
    }    
}