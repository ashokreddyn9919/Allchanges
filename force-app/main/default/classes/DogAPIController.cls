public class DogAPIController {
    
    @InvocableMethod(label='Get dog' description='Iterates')
    public static void getDogFacts(list<EnrolmentsRequest> Name) {
        String apiUrl = 'https://api.thedogapi.com/v1/breeds';
        
        //request
        HttpRequest request = new HttpRequest();
        request.setEndpoint(apiUrl);
        request.setMethod('GET');
        
   		//response
        Http http = new Http();
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            String responseBody = response.getBody();
            list<Items> deserializeditems = (list<Items>)JSON.deserialize(responseBody, list<Items>.class);
            
            List<Dog_Facts__c> alldogsGroups= new List<Dog_Facts__c>();
   			system.debug('deserializeditems-->: '+deserializeditems.size());
            for(Items deserializeditem:deserializeditems){
                Dog_Facts__c newItem = new Dog_Facts__c();
                EnrolmentsRequest Names = new EnrolmentsRequest();
                newItem.id__c = deserializeditem.id;
                //newItem.First_Name__c = Names.FirstName;
                //system.debug('newItem.First_Name__c-->: '+newItem.First_Name__c);
                //newItem.Last_Name__c  = Names.LastName;
                newItem.name = deserializeditem.Name;
                newItem.bred_for__c = deserializeditem.bred_for;
                newItem.breed_group__c = deserializeditem.breed_group;
                newItem.life_span__c = deserializeditem.life_span;
                newItem.temperament__c = deserializeditem.temperament;
                newItem.origin__c = deserializeditem.origin;
                newItem.reference_image_id__c = deserializeditem.reference_image_id;
                alldogsGroups.add(newItem);
            }
            Database.insert(alldogsGroups);
        	}
    }
    
    public DogAPIController() {}
    public class Items {
        public integer id {get;set;}
        public String name {get;set;}
        public String bred_for {get;set;}
        public String breed_group {get;set;}
        public String life_span {get;set;}
        public String temperament {get;set;}
        public String origin {get;set;}
        public String reference_image_id {get;set;}
    }
    
    public class EnrolmentsRequest{
        @InvocableVariable
        public String FirstName;
        @InvocableVariable
        public String LastName;
    }
}