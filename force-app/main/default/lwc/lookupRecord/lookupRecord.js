import { LightningElement, wire, api} from 'lwc';
import findAccount from "@salesforce/apex/accountlookup.findAccount";
import getRelatedContact from "@salesforce/apex/accountlookup.getRelatedContact";
import getCurrentAccount from "@salesforce/apex/accountlookup.getCurrentAccount";

const columns=[
    {
        label: 'Name',
        fieldName: 'Name'
    },
    {
        label: 'Title',
        fieldName: 'Title'
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'email'
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone'
    }
];

export default class LookupRecords extends LightningElement {
    searchKey='';
    accountId = "null";
    columns = columns;
    showContact = false;
    accountName = '';

    @wire(findAccount, {searchKey: "$searchKey"})
    accounts;

    @wire(getRelatedContact, {accountId: "$accountId"})
    contacts;

    @wire(getCurrentAccount, {accountId: "$accountId"})
    accounts1;

    handleKeyChange(event){
        this.searchKey = event.target.value;
    }

    handleClick(event){
        this.showContact = true;
        this.accountId = event.currentTarget.value;
        
    }

    handleReset(){
        this.showContact = false;
        this.searchKey='';
    }
}