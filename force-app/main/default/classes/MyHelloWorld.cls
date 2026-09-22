public class MyHelloWorld {
    
   public static void applyDiscount(Books__c[] books) {      
       System.debug('ashok' +books);      
       for (Books__c b :books){
         b.Average_Rating__c *= 0.4;
      }
   }
}