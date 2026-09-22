import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import getRelatedAccounts from '@salesforce/apex/AccountController.getRelatedAccounts';

export default class RecordEditFormExample extends LightningElement {
    @api recordId;
    @api objectApiName = ACCOUNT_OBJECT;
    @api NAME_FIELD = NAME_FIELD;
    @api ACCOUNT_NUMBER_FIELD = ACCOUNT_NUMBER_FIELD;

    relatedAccounts = [];
    error;

    // Wire method to fetch related accounts
    @wire(getRelatedAccounts, { accountId: '$recordId' })
    wiredRelatedAccounts({ data, error }) {
        if (data) {
            this.relatedAccounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.relatedAccounts = [];
        }
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Success",
            message: "Record has been saved successfully!",
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
}