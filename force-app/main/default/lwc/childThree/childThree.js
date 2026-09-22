import { LightningElement,track, api } from 'lwc';

export default class ChildOne extends LightningElement {

    @track ChildSelect = true;
  
    handleClickSelect(event){
        this.ChildSelect = false;
        const name = "Selected";
        //console.log('test1:' +name);
        const selectEvent = new CustomEvent('mythirdchild', {detail:name});
        //console.log('test2:' +selectEvent.detail);
        this.dispatchEvent(selectEvent);
    }

    handleClickDeselect(event){
        this.ChildSelect = true;
        const name = "Deselected";
        const selectEvent = new CustomEvent('mythirdchild', {detail:name});        
        this.dispatchEvent(selectEvent);
    }
}