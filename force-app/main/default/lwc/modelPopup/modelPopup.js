import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = ['Account.Rating'];

export default class ModelPopup extends LightningElement {
    @api recordId; // Account Record ID from the record page
    isModalVisible = false;

    // Fetch Account data
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredAccount({ error, data }) {
        if (data) {
            const rating = data.fields.Rating.value;
            if (rating === 'Hot') {
                this.isModalVisible = true;
            }
        } else if (error) {
            console.error('Error fetching Account data:', error);
        }
    }

    // Close the modal
    closeModal() {
        this.isModalVisible = false;
    }
}