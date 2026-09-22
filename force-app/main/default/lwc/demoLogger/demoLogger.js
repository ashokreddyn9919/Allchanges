import { LightningElement } from 'lwc';
import {log} from 'lightning/logger';
import lightningAlert from 'lightning/alert';

export default class DemoLogger extends LightningElement {

    connectedCallback(){
        let msg = {
            type:'component Load',
            action:'Load'
        };
        log(msg);
    }
    
    handleSuccess(){
        let msg = {
            type: 'click',
            action:'success'
        };
        log(msg);

        lightningAlert.open({
            message :'Success!',
            theme : 'success',
            label : 'Success!!!'
        });
    }
}