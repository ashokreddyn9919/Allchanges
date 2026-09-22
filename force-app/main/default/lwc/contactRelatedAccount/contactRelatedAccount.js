import { LightningElement, api, wire, track } from 'lwc';
import getRelatedAccounts from '@salesforce/apex/AccountLookupController.getRelatedAccounts';

export default class ContactRelatedAccount extends LightningElement {
    @api criteriaField; // Field or parameter to filter related accounts
    @track relatedAccounts = [];
    @track accountOptions = [];
    @track selectedAccount;

    @api recordId;

    // Fetch related accounts based on the provided criteria
    @wire(getRelatedAccounts, { criteriaField: '$recordId' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.relatedAccounts = data;
            this.accountOptions = data.map(account => ({
                label: account.Name,
                value: account.Id
            }));
        } else if (error) {
            this.relatedAccounts = [];
            this.accountOptions = [];
            console.error('Error fetching related accounts:', error);
        }
    }

    handleAccountChange(event) {
        this.selectedAccount = event.detail.value; // Capture selected account
        console.log('Selected Account Id:', this.selectedAccount);

        // Dispatch an event to notify parent component or layout
        const accountSelectEvent = new CustomEvent('accountselect', {
            detail: { accountId: this.selectedAccount }
        });
        this.dispatchEvent(accountSelectEvent);
    }
}