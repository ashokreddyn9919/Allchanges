import { LightningElement, track } from 'lwc';

export default class HelloAvyaan extends LightningElement {
    @track dynamicGreeting = 'World';
    GreetingChangeHandler(event){
        this.dynamicGreeting=event.target.value;
    }
}