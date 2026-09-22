import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AccountLaunchLwc extends NavigationMixin(LightningElement) {
    showModal = true;
    selectedSource = '';
    filteredRecordTypes = [];

    sourceOptions = [
        { label: 'DNB', value: 'DNB' },
        { label: 'EPH', value: 'EPH' }
    ];

    dnbRecordTypes = [
        { label: 'Advocate', value: 'Advocate', description: 'Advocate record type' },
        { label: 'EED', value: 'EED', description: 'EED record type' },
        { label: 'General', value: 'General', description: 'General record type' },
        { label: 'Broker', value: 'Broker', description: 'Broker record type' },
        { label: 'Lender', value: 'Lender', description: 'Lender record type' }
    ];

    ephRecordTypes = [
        { label: 'General', value: 'General', description: 'General record type' },
        { label: 'Broker', value: 'Broker', description: 'Broker record type' },
        { label: 'Lender', value: 'Lender', description: 'Lender record type' }
    ];

    handleSourceChange(event) {
        this.selectedSource = event.detail.value;

        if (this.selectedSource === 'DNB') {
            this.filteredRecordTypes = [...this.dnbRecordTypes];
        } else if (this.selectedSource === 'EPH') {
            this.filteredRecordTypes = [...this.ephRecordTypes];
        } else {
            this.filteredRecordTypes = [];
        }
    }

    handleRecordTypeClick(event) {
        const recordTypeName = event.currentTarget.dataset.value;

        if (this.selectedSource === 'DNB') {
            this.navigateToComponent('c__lwcAComponent', recordTypeName);
        } else if (this.selectedSource === 'EPH') {
            this.navigateToComponent('c__lwcBComponent', recordTypeName);
        }
    }

    navigateToComponent(componentName, recordTypeName) {
        this.showModal = false;

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: componentName
            },
            state: {
                c__recordTypeName: recordTypeName,
                c__sourceType: this.selectedSource
            }
        });
    }

    handleCancel() {
        this.showModal = false;

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        });
    }
}