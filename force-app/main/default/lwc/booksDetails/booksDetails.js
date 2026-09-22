import { LightningElement, track, wire, api } from 'lwc';
import { getRecord, getFieldValue  } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

import BOOK_ID from '@salesforce/schema/Books__c.Name';
import BOOK_TITLE from '@salesforce/schema/Books__c.Title__c';
import BOOK_IMG from '@salesforce/schema/Books__c.image_url__c';
import BOOK_AUTHOR from '@salesforce/schema/Books__c.Author__c';
import BOOK_PUBLISHER from '@salesforce/schema/Books__c.Publisher__c';
import BOOK_ISBN13 from '@salesforce/schema/Books__c.ISBN13__c';
import BOOK_ISBN from '@salesforce/schema/Books__c.ISBN__c';
import BOOK_YEARPUB from '@salesforce/schema/Books__c.Year_Published__c';
import BOOK_BINDING from '@salesforce/schema/Books__c.Binding__c';
import BOOK_PAGES from '@salesforce/schema/Books__c.Number_of_Pages__c';
import BOOK_GOODREADS from '@salesforce/schema/Books__c.Goodreads_Id__c';
import BOOK_RATING from '@salesforce/schema/Books__c.Average_Rating__c';

const FIELDS = [BOOK_TITLE,BOOK_IMG,BOOK_AUTHOR,BOOK_PUBLISHER,BOOK_ISBN13,
    BOOK_ISBN,BOOK_YEARPUB,BOOK_BINDING,BOOK_PAGES,BOOK_GOODREADS,BOOK_RATING]

export default class BooksDetails extends LightningElement {
    @api bookId;
    @track SelectedTabValue;
    @track selectBookId;

    @wire(CurrentPageReference) pageRef;
    
    @wire(getRecord, {recordId:'$bookId', fields: FIELDS})
    book;
    
    @track error;
    handlerDeleteBook(event) {
        deleteRecord(this.bookId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    
    connectedCallback(){
        //console.log('method data--:',this.callBackMethod)
        registerListener('bookselect', this.callBackMethod, this);
    }
    
    callBackMethod(payload){
        this.bookId = payload;
        console.log('data-->', this.bookId)
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    tabChangeHandler(event){
        this.selectedTabValue = event.target.value;
    }

    get bookFound(){
        if(this.book.data){
            return true;
        } 
        return false;
    }

    get bookTitle(){
        return getFieldValue(this.book.data, BOOK_TITLE);
    }

    get bookImage(){
        return getFieldValue(this.book.data, BOOK_IMG);
    }

    get bookAuthor(){
        return getFieldValue(this.book.data, BOOK_AUTHOR);
    }

    get bookPublisher(){
        return getFieldValue(this.book.data, BOOK_PUBLISHER);
    }

    get bookISBN3(){
        return getFieldValue(this.book.data, BOOK_ISBN13);
    }

    get bookISBN(){
        return getFieldValue(this.book.data, BOOK_ISBN);
    }

    get bookYear(){
        return getFieldValue(this.book.data, BOOK_YEARPUB);
    }

    get bookBinding(){
        return getFieldValue(this.book.data, BOOK_BINDING);
    }

    get bookPages(){
        return getFieldValue(this.book.data, BOOK_PAGES);
    }

    get bookGoodReads(){
        return getFieldValue(this.book.data, BOOK_GOODREADS);
    }

    get bookRating(){
        return getFieldValue(this.book.data, BOOK_RATING);
    }
}