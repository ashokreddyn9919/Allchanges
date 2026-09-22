global with sharing class SearchBookEntity {
    @AuraEnabled
    global cls_GoodreadsResponse GoodreadsResponse;
    global class cls_GoodreadsResponse {
        @AuraEnabled
        global cls_Request Request;
        global cls_search search;
    }
    global class cls_Request {
        global String authentication; //true
    }
    global class cls_search {        
        @AuraEnabled
        global List<cls_results> results;
    }
    global class cls_results {
        @AuraEnabled
        global cls_id id; 
        @AuraEnabled
        global cls_original_publication_year original_publication_year;
        @AuraEnabled
        global String average_rating{get;set;} //4.01
        @AuraEnabled
        global cls_best_book best_book;
    }
    global class cls_id {
        global String type; //integer
        @AuraEnabled
        global String ele_text{get;set;} //1265
    }

    global class cls_original_publication_year {
        @AuraEnabled
        global String type; //integer
        @AuraEnabled
        global String ele_text{get;set;} //1815
    }
    
    global class cls_best_book {
        @AuraEnabled
        global cls_id id{get;set;}
        @AuraEnabled
        global String title{get;set;} //Emma
        @AuraEnabled
        global cls_author author{get;set;}
        @AuraEnabled
        global String image_url{get;set;} //https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1373627931l/6969._SX98_.jpg
        @AuraEnabled
        global String small_image_url{get;set;} //https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1373627931l/6969._SY75_.jpg
        @AuraEnabled
        global String type{get;set;} //Book
    }
    global class cls_author {
        @AuraEnabled
        global cls_id id{get;set;}
        @AuraEnabled
        global String name{get;set;}
    }
    global static SearchBookEntity parse(String json){
        return (SearchBookEntity) System.JSON.deserialize(json, SearchBookEntity.class);
    }    
}