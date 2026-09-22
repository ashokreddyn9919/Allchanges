import { LightningElement, api, track, wire} from 'lwc';
import BooksTitle from '@salesforce/apex/booksSearchController.getBooksfrom';
import { getRecord } from 'lightning/uiRecordApi';
export default class SearchBooksLibrary extends LightningElement {

    @track BooksList= [];
    BookTitile = '';
    DisplayCount;
    BookDetails;
    totalbooks;
    BookId;
    visibleBooks
    @track selectedBookId;
    @api book;

    @wire(BooksTitle,{bookTitle:'$BookTitile'})
    retriveBooks({error,data}){
        if(data){
            this.BooksList=data;
            this.DisplayCount=this.BooksList.length;
            //console.log('Records',this.DisplayCount)
           }else if(error){

        }        
    }

    @wire(getRecord, {recordId:'$BookId'})
    BooksDetails;

    handleKeyChange(event){
        const searchstring = event.target.value;
        this.BookTitile = searchstring;
    }

    bookSelectHandler(event){
        const bookId = event.detail;
        this.selectedBookId = bookId;
    }

    updateBookHandler(event){
        this.visibleBooks=[...event.detail.records]
        console.log(event.detail.records)
    }

}