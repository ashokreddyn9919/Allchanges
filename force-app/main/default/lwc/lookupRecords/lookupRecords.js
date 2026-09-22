import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/accountLookupControllerLwc.getAccounts';
const DELAY = 300;
export default class SearchAccount extends LightningElement {
    accountName='';
    @track accountList=[];    
    @wire(getAccounts,{accName:'$accountName'})
    retrieveAccounts({error,data}){
        console.log("Data-->",data)
        if(data){
            this.accountList=data;          
        }
        else if(error){

        }
        
    }
    handleKeyChange(event){
        //this.accountName = event.target.value;
        this.accountName = event.target.value;
        console.log("Value-->", this.accountName)
    }
}