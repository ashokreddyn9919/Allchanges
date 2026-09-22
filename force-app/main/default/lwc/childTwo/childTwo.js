import { LightningElement,track, api } from 'lwc';

export default class ChildOne extends LightningElement {

    @track ChildSelect2 = true;
  
    handleClickSelect2(event){
        this.ChildSelect2 = false;
        const name = "Selected";
        console.log('test1:' +name);
        const selectEventA = new CustomEvent('mysecondchild', {detail:name});
        console.log('test2:' +selectEventA.detail);
        this.dispatchEvent(selectEventA);
    }

    handleClickDeselect2(event){
        this.ChildSelect2 = true;
        const name = "Deselected";
        const selectEvent = new CustomEvent('mysecondchild', {detail:name});        
        this.dispatchEvent(selectEvent);
    }
}