import { LightningElement, api, wire, track } from 'lwc';
import getFilteredContacts from '@salesforce/apex/OppLookupController.getFilteredContacts';

export default class OpportunityLookupWithFilters extends LightningElement {
    @api recordId; // Current Account Id from the record page
    @track contacts = [];
    @track error;
    @track searchTitle = '';

    @wire(getFilteredContacts, { accountId: '$recordId'})
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.error = undefined;
        } else if (error) {
            this.contacts = [];
            this.error = error;
        }
    }

    handleTitleSearch(event) {
        this.searchTitle = event.target.value;
    }
}