import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import getRelatedAccounts from '@salesforce/apex/AccountController.getRelatedAccounts';

export default class ContactRecordEditForm extends LightningElement {
    @api recordId;
    @api objectApiName = CONTACT_OBJECT;
    @api FIRST_NAME_FIELD = FIRST_NAME_FIELD;
    @api LAST_NAME_FIELD = LAST_NAME_FIELD;
    @api EMAIL_FIELD = EMAIL_FIELD;
    @api ACCOUNT_FIELD = ACCOUNT_FIELD;

    // Holds related account options for dropdown
    accountOptions = [];
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
    }

    handleSuccess(event) {
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

    handleSubmit(event) {
        // Add selected account ID to the record submission
        event.preventDefault();
        const fields = event.detail.fields;
        fields.AccountId = this.selectedAccountId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
}