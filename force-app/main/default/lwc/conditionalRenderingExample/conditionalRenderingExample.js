import { LightningElement, track } from 'lwc';

export default class ConditionalRenderingExample extends LightningElement {
    @track display = false;
    @track cityList = ['Bangalore', 'Hyderabad', 'Chennai', 'Mumbai'];
    showdevhandler(event){
        this.display = event.target.checked;
    }
}