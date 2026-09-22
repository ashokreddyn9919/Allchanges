import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BookDetail extends NavigationMixin(LightningElement) {

    @api book;

   updateDetails(){
       this[NavigationMixin.Navigate]({
           type: "standard_recordPage",
           attributes :{
               recordId : this.book.data.fields.Id.value,
               objectApiName : "Books__c",
               actionaName : "view",
           }
       });
   }

   get bookTitle(){
       console.log('Data--2>', this.book.data.fields.Title__c.Value)
       try{
           return this.book.data.fields.Title__c.Value;
       }catch(error){
           return 'NA';
       }
   }

    get bookImage(){
        try{
            return this.book.data.fields.image_url__c.Value;                      
        }catch(error){
            return 'NA';
        }
    }

    get bookAuthor(){
        try{
            return this.book.data.fields.Author__c.Value;
        }catch(error){
            return 'NA';
        }
    }

    get bookPublisher(){
        try{
            return this.book.data.fields.Publisher__c.Value;
        }catch(error){
            return 'NA';
        }
    }

    get bookISBN3(){
        try{
            return this.book.data.fields.ISBN13__c.Value;
        }catch(error){
            return 'NA';
        }
    }

    get bookISBN(){
        try{
            return this.book.data.fields.ISBN__c.Value;
        }catch(error){
            return 'NA';
        }
    }
    get bookYear(){
        try{
            return this.book.data.fields.Year_Published__c.Value;
        }catch(error){
            return 'NA';
        }
    }
    get bookBinding(){
        try{
            return this.book.data.fields.Binding__c.Value;
        }catch(error){
            return 'NA';
        }
    }
    get bookPages(){
        try{
            return this.book.data.fields.Number_of_Pages__c.Value;
        }catch(error){
            return 'NA';
        }
    }
    get bookGoodReads(){
        try{
            return this.book.data.fields.Goodreads_Id__c.Value;
        }catch(error){
            return 'NA';
        }
    }
    get bookRating(){
        try{
            return this.book.data.fields.Average_Rating__c.Value;
        }catch(error){
            return 'NA';
        }
    }

}