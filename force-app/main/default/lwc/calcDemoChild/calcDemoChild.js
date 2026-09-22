import { LightningElement,api } from 'lwc';

export default class CalcDemoChild extends LightningElement {

    @api
    passLabel='';

    @api passValue='';
}