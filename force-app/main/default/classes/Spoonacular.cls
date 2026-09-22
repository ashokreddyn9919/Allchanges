public class Spoonacular {
    private static final string SPOONACULAR_API = 'https://api.spoonacular.com';
    private static final string SPOONACULAR_APIKEY = '449b6bf8457048cea7a1249be5bdd9f6';
    
    public static void getRandomReceipe(){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API +'/recipes/random?apiKey='+SPOONACULAR_APIKEY);
        request.setMethod('GET');
        
        HttpResponse response =http.send(request);
        System.debug('response Code' +response.getStatusCode());
        if(response.getStatusCode() == 200){
            system.debug('response' +response.getBody());
        }
    }
     public static void getReceipe(String receipeId){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        //https://api.spoonacular.com/recipes/{id}/information
        request.setEndpoint(SPOONACULAR_API +'/recipes/'+receipeId+'/information?apiKey='+SPOONACULAR_APIKEY);
        request.setMethod('GET');
        
        HttpResponse response =http.send(request);
        System.debug('response Code' +response.getStatusCode());
        if(response.getStatusCode() == 200){
            system.debug('response' +response.getBody());
        }
    }
    public static void getReceipeByIngredient(String ingredients){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API +'/recipes/findByIngredients?apiKey='+SPOONACULAR_APIKEY+'@ingredients=');
        request.setMethod('GET');
        
        HttpResponse response =http.send(request);
        System.debug('response Code' +response.getStatusCode());
        if(response.getStatusCode() == 200){
            system.debug('response' +response.getBody());
        }
    }
}