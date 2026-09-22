import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountTypeRecordTypeSelector extends NavigationMixin(LightningElement) {
    isDnbSelected = false;
    isEphSelected = false;
    selectedRecordType = '';

    dnbRecordTypes = [
        { name: 'Advocate', label: 'Advocate', description: 'Advocate Account Record Type' },
        { name: 'EED', label: 'EED', description: 'EED Account Record Type' },
        { name: 'General', label: 'General', description: 'General Account Record Type' },
        { name: 'Broker', label: 'Broker', description: 'Broker Account Record Type' },
        { name: 'Lender', label: 'Lender', description: 'Lender Account Record Type' },
        { name: 'EPHAccount', label: 'EPH Account', description: 'EPH Account Record Type' }
    ];

    ephRecordTypes = [
        { name: 'General', label: 'General', description: 'General Account Record Type' },
        { name: 'Broker', label: 'Broker', description: 'Broker Account Record Type' },
        { name: 'Lender', label: 'Lender', description: 'Lender Account Record Type' },
        { name: 'EPHAccount', label: 'EPH Account', description: 'EPH Account Record Type' }
    ];

    @track filteredRecordTypes = [];

    get showRecordTypes() {
        return this.filteredRecordTypes.length > 0;
    }

    handleDnbChange(event) {
        const checked = event.target.checked;

        this.isDnbSelected = checked;
        this.isEphSelected = false;
        this.selectedRecordType = '';

        if (checked) {
            this.filteredRecordTypes = this.dnbRecordTypes.map(item => ({
                ...item,
                checked: false
            }));
        } else {
            this.filteredRecordTypes = [];
        }
    }

    handleEphChange(event) {
        const checked = event.target.checked;

        this.isEphSelected = checked;
        this.isDnbSelected = false;
        this.selectedRecordType = '';

        if (checked) {
            this.filteredRecordTypes = this.ephRecordTypes.map(item => ({
                ...item,
                checked: false
            }));
        } else {
            this.filteredRecordTypes = [];
        }
    }

    handleRecordTypeChange(event) {
        this.selectedRecordType = event.target.value;

        this.filteredRecordTypes = this.filteredRecordTypes.map(item => ({
            ...item,
            checked: item.name === this.selectedRecordType
        }));
    }

    handleCancel() {
        // Example: navigate back to Account object home
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'home'
            }
        });
    }

    handleNext() {
        if (!this.isDnbSelected && !this.isEphSelected) {
            this.showError('Please select Account Type.');
            return;
        }

        if (!this.selectedRecordType) {
            this.showError('Please select a Record Type.');
            return;
        }

        const componentName = this.isDnbSelected
            ? 'c__dnbAccountCreateWrapper'
            : 'c__ephAccountCreateWrapper';

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: componentName
            },
            state: {
                c__isDnb: this.isDnbSelected,
                c__isEph: this.isEphSelected,
                c__recordTypeName: this.selectedRecordType
            }
        });
    }

    showError(message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message,
                variant: 'error'
            })
        );
    }
}