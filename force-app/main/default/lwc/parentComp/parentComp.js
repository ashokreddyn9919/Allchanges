import { LightningElement,track } from 'lwc';

export default class ParentComp extends LightningElement {

    @track greeting;
    @track second;
    @track third;

    handleCustomEventA(event){
        this.greeting = event.detail;
    }
    handleCustomEventB(event){
        this.second = event.detail;
    }
    handleCustomEventC(event){
        this.third = event.detail;
    }
    
    
}