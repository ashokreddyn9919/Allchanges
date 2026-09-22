public with sharing class booksSearchController {
    public booksSearchController() {

    }    
    
    @AuraEnabled(cacheable=true)
    public static List<Books__c> getBooksfrom(string bookTitle){
        String Keystring = '%' +bookTitle+ '%';
        system.debug('bookTitle---->'+Keystring);
        return [Select Id,Title__c,image_url__c,Author__c,Publisher__c, ISBN13__c,ISBN__c, Year_Published__c,Binding__c, Number_of_Pages__c,Goodreads_Id__c, Average_Rating__c from Books__c  where Title__c like:Keystring];
    }

    @AuraEnabled(cacheable=true)
    public static SearchBookEntity getbooks(string searchRecord){
            string SearchKey = searchRecord;
            string url ='https://www.goodreads.com/search/index.xml?key=RVUDBa0yOL5hPLaTvrYIdw&q='+SearchKey;			
            system.debug('URL testing--->' +url);
            HttpRequest req = new HttpRequest();
            req.setMethod('GET');
            req.setEndPoint(url);        
            Http http = new Http();
            HttpResponse res = http.send(req);        
            string body = res.getBody();
            String jsonContent = XmlParser.xmlToJson(body);
            system.debug('final values:--->' +jsonContent);
            SearchBookEntity BookResults=new SearchBookEntity();
            BookResults = SearchBookEntity.parse(jsonContent);
            return BookResults;                     	
    }        
}