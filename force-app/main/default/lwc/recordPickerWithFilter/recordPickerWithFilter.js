import { LightningElement } from 'lwc';

export default class RecordPickerWithFilter extends LightningElement {

    matchingInfo = {
        primaryField: { fieldPath: "Name" },
        additionalFields: [{fieldPath: "Title" }],
    };
    displayInfo = {
        additionalFields: ["Title"],
    };
    filter = {
        criteria: [
            {
                fieldPath: "Account. Name",
                operator: "like",
                value: "Madison%",
        },
        ],
    };
    handleChange(event){
        console. log('Selected record: ${event.detail.recordId}');
    }
}