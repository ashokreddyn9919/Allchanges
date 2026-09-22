import { LightningElement, api, track, wire } from 'lwc';
import ExternalBooks from '@salesforce/apex/booksSearchController.getbooks';

export default class SearchBookExternal extends LightningElement {

    BookTitile = '';
    @track BookResults=[];
    @track errorMsg = '';

    @wire(ExternalBooks,{searchRecord:'$BookTitile'})
    retrivebooks({error,data}){
        console.log('Testing Data:', data)
        if(data){
            this.BookResults=JSON.parse(JSON.stringify(data));           
            console.log('Books Data:', this.BookResults)
        } else if(error){

        }
    }

    handlerBookSearch(event){
        const searchkey = event.target.value;
        this.BookTitile = searchkey;
        console.log('Search Value:',  this.BookTitile)
    }

    handleKeyChange(){
        if(!this.BookTitile){
            this.errorMsg = 'Please enter book name to search.';
            console.log('empty value:', this.errorMsg)
        }
    }

}