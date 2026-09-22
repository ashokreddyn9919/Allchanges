public class MakeCallOut {
    
    public static void MakeCalloutmethod(){
        String Endpoint = 'www.google.com';
        
        HttpRequest request=new HttpRequest();
        request.setEndpoint(EndPoint);
        request.setMethod('GET');
        
        http http=new Http();
        HttpResponse response=http.send(request);
        if(response.getStatusCode() == 200){
            String data=response.getbody();
            List<Account> Acc=(List<Account>)JSON.deserialize(data, List<Account>.class);
            List<Contact> allcustoms=new List<Contact>();
            for(Account a:Acc){
                Contact c=new Contact();
                c.FirstName = a.Name;
                c.Phone = a.Phone;
                allcustoms.add(c);
            }
            database.Update(allcustoms);
        }
    }

}