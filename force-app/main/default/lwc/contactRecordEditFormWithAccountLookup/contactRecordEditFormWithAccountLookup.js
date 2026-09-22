import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import getRelatedAccounts from '@salesforce/apex/AccountController.getRelatedAccounts';
import getAccountsBySearch from '@salesforce/apex/AccountController.getAccountsBySearch';

export default class ContactRecordEditFormWithAccountLookup extends LightningElement {
    @api recordId;
    @api objectApiName = CONTACT_OBJECT;
    @track accountOptions = []; // Holds search results for accounts
    @track selectedAccountId;
    @track searchKey = '';
    @track isDirty = true; // Tracks if fields are modified
    selectedAccountId;
    error;

    // Fetch related accounts dynamically
    @wire(getRelatedAccounts, { contactId: '$recordId' })
    wiredRelatedAccounts({ data, error }) {
        if (data) {
            this.accountOptions = data.map(account => ({
                label: account.Name,
                value: account.Id,
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accountOptions = [];
        }
    }

    handleAccountChange(event) {
        this.selectedAccountId = event.detail.value;
        console.log('this.selectedAccountId' +this.selectedAccountId );
        this.isDirty = false; // Mark as modified
        console.log('this.isDirty' +this.isDirty );
    }

    handleFieldChange() {
        this.isDirty = true; // Mark as modified when any field is changed
    }

    handleSubmit(event) {
        // Add selected account ID to the record submission
        event.preventDefault();
        const fields = event.detail.fields;
        fields.AccountId = this.selectedAccountId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        this.isDirty = true; // Reset to not modified after save
        const evt = new ShowToastEvent({
            title: "Success",
            message: "Contact record has been saved successfully!",
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

    handleError(event) {
        const evt = new ShowToastEvent({
            title: "Error",
            message: event.detail.message,
            variant: "error"
        });
        this.dispatchEvent(evt);
    }


    handleSearchChange(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length >= 2) {
            // Fetch accounts based on the search key
            getAccountsBySearch({ searchKey: this.searchKey })
                .then((data) => {
                    this.accountOptions = data.map((account) => ({
                        label: account.Name,
                        value: account.Id,
                    }));
                })
                .catch((error) => {
                    this.accountOptions = [];
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error fetching accounts',
                            message: error.body.message,
                            variant: 'error',
                        })
                    );
                });
        } else {
            this.accountOptions = []; // Clear options if the search key is too short
        }
    }

    handleAccountSelect(event) {
        this.selectedAccountId = event.target.dataset.value; // Retrieve the selected account Id
        this.isDirty = true; // Mark the form as modified
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.AccountId = this.selectedAccountId; // Set selected account Id
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
}