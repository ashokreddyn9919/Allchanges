public class IntegrationDemo {
    
    public static void testintegration(String Username, string useremail){
        http http=new Http();
        HttpRequest req=new HttpRequest();
        req.setHeader('Authorization','Bearer 7d620f115074334bd2a410fb291087cfdac1a9d9cc93d562245a94df11c406f2');
        //req.setHeader('Accept','application/json');
        //req.setHeader('content-Type','application/json');
        req.setEndpoint('https://gorest.co.in/public/v2/users/6757133');
        req.setMethod('GET');
        //string reqBody = '{"name":"'+Username+'", "gender":"male", "email":"'+useremail+'", "status":"active"}';
        //system.debug('Request body--> '+reqBody);
        //req.setbody(reqBody);
        
        HttpResponse res = http.send(req);
        system.debug('response status --> '+res.getStatusCode());
        system.debug('response Body --> '+res.getBody());
    }
}