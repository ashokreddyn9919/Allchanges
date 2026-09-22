import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';

export default class AccountNewForm extends NavigationMixin(LightningElement) {
    @track name = '';

    handleName(event) {
        this.name = event.target.value;
    }

    async handleSave() {
        try {
            const fields = {};
            fields[NAME_FIELD.fieldApiName] = this.name;

            const recordInput = {
                apiName: ACCOUNT_OBJECT.objectApiName,
                fields
            };

            const result = await createRecord(recordInput);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created successfully',
                    variant: 'success'
                })
            );

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: result.id,
                    objectApiName: 'Account',
                    actionName: 'view'
                }
            });
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating Account',
                    message: error.body?.message || error.message,
                    variant: 'error'
                })
            );
        }
    }

    handleCancel() {
        history.back();
    }
}