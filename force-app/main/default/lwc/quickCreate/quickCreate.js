import { LightningElement } from 'lwc';

export default class QuickCreate extends LightningElement {


    AccountRecords
    ContactRecords
    OpportunityRecords
    
    ShowButon=true;
    ShowConButon=true;
    ShowOppButon=true;

    handleShowAccounts(event){
        this.AccountRecords=true;
        this.ShowButon=false;
    }
    handleHideAccounts(event){
        this.AccountRecords=false;
        this.ShowButon=true;
    }

    handleShowContacts(event){
        this.ContactRecords=true;
        this.ShowConButon=false;
    }
    handleHideContacts(event){
        this.ContactRecords=false;
        this.ShowConButon=true;
    }

    handleShowOpportunity(event){
        this.OpportunityRecords=true;
        this.ShowOppButon=false;
    }
    handleHideOpportunity(event){
        this.OpportunityRecords=false;
        this.ShowOppButon=true;
    }

    handleAccountReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    handleContactReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    handleOppReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}