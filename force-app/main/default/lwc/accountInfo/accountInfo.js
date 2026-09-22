import { LightningElement, api, wire, track } from 'lwc';
import { getAccountInfo} from 'lightning/uiRecordApi';
import Account_Name from '@salesforce/schema/Account.Name';
export default class AccountInfo extends LightningElement {

    @api recordid;
    accountname;
    Street;
    billingCity;
    billingCountry;

CountryOptions = [
{label:'USA', value:'USA'}, 
{label:'UK', value:'UK'},
{label:'CANADA', value:'Canada'},
{label:'UK', value:'UK'}

];

@wire(getAccountInfo, {recordId: '$recordid', fields: [Account_Name]})
wiredAccount({error, data}){
    if(data){
        this.accountname = data.fields.Name.value;
        } else if(error){
        console.error('Error fetching account data:', error);
    }
    }
}