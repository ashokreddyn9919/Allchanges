public with sharing class CarSearchFormController {
    @AuraEnabled(cacheable=true)
    public static List<Car_Type__c> getCarTypes(){
        return [SELECT Id, Name FROM Car_Type__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(String carTypeId){
        
        if(String.isEmpty(carTypeId)){
            return [SELECT Id, Name, Picture__c, Contact__r.Name,
                    Geolocation__latitude__s, Geolocation__longitude__s
                    FROM Car__c 
                    WHERE Available_For_Rent__c = true ];
        } else{
            return [SELECT Id, Name, Picture__c, Contact__r.Name,
                    Geolocation__latitude__s, Geolocation__longitude__s
                    FROM Car__c 
                    WHERE Available_For_Rent__c = true 
                    AND Car_type__c =: carTypeId];
        }

    }
}