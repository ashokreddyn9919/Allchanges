import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class AccountNewSelector extends NavigationMixin(LightningElement) {
    @track isDnbSelected = false;
    @track isEphSelected = false;
    @track filteredRecordTypes = [];

    allDnbRecordTypes = [
        { name: 'Advocate', label: 'Advocate', description: 'Advocate Account Record Type' },
        { name: 'EED', label: 'EED', description: 'EED Account Record Type' },
        { name: 'General', label: 'General', description: 'General Account Record Type' },
        { name: 'Broker', label: 'Broker', description: 'Broker Account Record Type' },
        { name: 'Lender', label: 'Lender', description: 'Lender Account Record Type' }
    ];

    allEphRecordTypes = [
        { name: 'General', label: 'General', description: 'General Account Record Type' },
        { name: 'Broker', label: 'Broker', description: 'Broker Account Record Type' },
        { name: 'Lender', label: 'Lender', description: 'Lender Account Record Type' }
    ];

    handleDnbChange(event) {
        this.isDnbSelected = event.target.checked;

        if (this.isDnbSelected) {
            this.isEphSelected = false;
            this.filteredRecordTypes = [...this.allDnbRecordTypes];
        } else {
            this.filteredRecordTypes = [];
        }
    }

    handleEphChange(event) {
        this.isEphSelected = event.target.checked;

        if (this.isEphSelected) {
            this.isDnbSelected = false;
            this.filteredRecordTypes = [...this.allEphRecordTypes];
        } else {
            this.filteredRecordTypes = [];
        }
    }

    handleRecordTypeClick(event) {
        const recordTypeName = event.currentTarget.dataset.name;

        if (this.isDnbSelected) {
            this.navigateToComponent('c__lwcAComponent', recordTypeName, 'DNB');
        } else if (this.isEphSelected) {
            this.navigateToComponent('c__lwcBComponent', recordTypeName, 'EPH');
        }
    }

    navigateToComponent(componentName, recordTypeName, sourceType) {
        this.dispatchEvent(new CloseActionScreenEvent());

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: componentName
            },
            state: {
                c__recordTypeName: recordTypeName,
                c__sourceType: sourceType
            }
        });
    }
}