import { LightningElement, track, wire } from 'lwc';

export default class AvyaanWorld extends LightningElement {

   @track Name = 'Hey how r u doing?';

   greetingChangeHandler(event){
       this.Name = event.target.value;
   } 
}