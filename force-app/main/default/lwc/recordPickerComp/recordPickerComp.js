import { LightningElement } from 'lwc';

export default class RecordPickerComp extends LightningElement {

    handleContactChange(event){
        const selectedRecordId = event.detail.recordId;
        console.log('selectedRecordId======>'+selectedRecordId);
    }

    matchingInfo = {
        primaryField:{fieldPath:'Name'},
        additionalFields:[{fieldPath:'Title'}]
    }
    displayInfo={
        additionalFields:['Title']
    }
    filter = {
        criteria:[
            {field:'Account.Name', operator: 'like', value:'Trigger%'}
        ]
    };

    handleChange1(event){
        console.log(`selected record Id ${event.detail.recordId}`);
    }
}