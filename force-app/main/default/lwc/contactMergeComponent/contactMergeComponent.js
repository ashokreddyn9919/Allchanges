import { LightningElement, wire, track } from 'lwc';
import getContactsByOwner from '@salesforce/apex/ContactController.getContactsByOwner';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactMergeComponent extends LightningElement {
    @track contacts = [];
    @track selectedContacts = [];
    @track showModal = false;
    @track showError = false;
    @track errorMessage = '';
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    columns = [
        { label: 'First Name', fieldName: 'FirstName'},
        { label: 'Last Name', fieldName: 'LastName'},
        { label: 'Email', fieldName: 'Email', sortable: true },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Account Name', fieldName: 'AccountName' }, 
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: true }
    ];

    @wire(getContactsByOwner)
    wiredContacts({ error, data }) {
        if (data) {
            // Map the Account.Name into AccountName so it can be displayed in the datatable
            this.contacts = data.map(contact => {
                return {
                    ...contact,
                    AccountName: contact.Account ? contact.Account.Name : '' // Flatten the Account Name
                };
            });
            console.log('data-->' + JSON.stringify(this.contacts));
        } else if (error) {
            this.showErrorToast('Error loading contacts', error.body.message);
        }
    }

    handleRowSelection(event) {
        this.selectedContacts = event.detail.selectedRows;
    }

    handleMerge() {
        if (this.selectedContacts.length !== 2) {
            this.showErrorToast('Invalid Selection', 'Please select exactly 2 contacts to merge.');
        } else {
            const [contact1, contact2] = this.selectedContacts;
            if (contact1.Email === contact2.Email && contact1.AccountId === contact2.AccountId) {
                this.showModal = true;
            } else {
                this.showErrorToast('Not Duplicates', 'The two selected contacts are not duplicates. You cannot merge them.');
            }
        }
    }

    showErrorToast(title, message) {
        this.showError = true;
        this.errorMessage = message;
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: 'error'
        });
        this.dispatchEvent(toastEvent);
    }

    closeModal() {
        this.showModal = false;
    }

    performMerge() {
        this.showModal = false;
        this.showSuccessToast('Success', 'Contacts merged successfully!');
    }

    showSuccessToast(title, message) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.contacts];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.contacts = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}