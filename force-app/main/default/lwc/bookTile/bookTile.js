import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class BookTile extends LightningElement {
@api book;
@api bookSelectedId;

    @wire(CurrentPageReference) pageRef;

    handleBookSelect(event){
        event.preventDefault();

        const bookId = this.book.Id;

        const bookSelect = new CustomEvent('bookselect', {detail:bookId});
        this.dispatchEvent(bookSelect);
        console.log('recordId:', this.book.Id)
        fireEvent(this.pageRef, 'bookselect', this.book.Id);
    }

    get isBookSelected(){
        if(this.book.Id === this.bookSelectedId){
            return "tile selected";
        }
        return "tile";
    }

}