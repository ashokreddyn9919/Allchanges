import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';

export default class AccountRecordForm extends LightningElement {
    @api recordId;
    @api objectApiName;
    
    //fieldArray = [NAME_FIELD,PHONE_FIELD,WEBSITE_FIELD];

    handlersuccess(event){
        this.recordId = event.detail.id;
    }
}