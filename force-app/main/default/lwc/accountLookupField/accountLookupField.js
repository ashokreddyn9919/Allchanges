import { LightningElement, track } from 'lwc';
import getAccounts from '@salesforce/apex/LookupController.getAccounts';

export default class AccountLookupField extends LightningElement {
    @track searchKey = '';
    @track accounts = [];
    @track selectedAccount;

    handleSearch(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length > 2) {
            getAccounts({ searchTerm: this.searchKey })
                .then((result) => {
                    this.accounts = result;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    handleSelect(event) {
        const selectedId = event.currentTarget.dataset.id;
        this.selectedAccount = this.accounts.find(acc => acc.Id === selectedId);
        this.accounts = []; // Clear suggestions after selection
    }
}