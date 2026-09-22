import { LightningElement, track } from 'lwc';

export default class ConditionalRendering extends LightningElement {

    @track displayDiv;

    showHandler(event){
        this.displayDiv = event.target.checked;
    }
}