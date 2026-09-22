import { LightningElement, api, track } from 'lwc';
import getContactsForAccount from '@salesforce/apex/ContactLookupController.getContactsForAccount';

export default class ContactLookup extends LightningElement {
    @api accountId; // Account Id passed as input
    @track contactOptions = []; // Filtered contact options
    @track searchKey = ''; // Input search key
    @track selectedContactName = ''; // Selected contact name

    allContacts = []; // Store all contacts fetched for the account

    connectedCallback() {
        if (this.accountId) {
            this.fetchContacts();
        }
    }

    async fetchContacts() {
        try {
            const contacts = await getContactsForAccount({ accountId: this.accountId });
            this.allContacts = contacts.map(contact => ({
                label: contact.Name,
                value: contact.Id
            }));
            this.contactOptions = [...this.allContacts];
        } catch (error) {
            console.error('Error fetching contacts: ', error);
        }
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();
        if (this.searchKey) {
            this.contactOptions = this.allContacts.filter(contact =>
                contact.label.toLowerCase().includes(this.searchKey)
            );
        } else {
            this.contactOptions = [...this.allContacts];
        }
    }

    handleContactSelect(event) {
        const contactId = event.target.dataset.id;
        const contact = this.allContacts.find(c => c.value === contactId);
        if (contact) {
            this.selectedContactName = contact.label;

            // Dispatch an event to notify the parent component
            const selectedEvent = new CustomEvent('contactselect', {
                detail: contactId
            });
            this.dispatchEvent(selectedEvent);
        }
    }
}