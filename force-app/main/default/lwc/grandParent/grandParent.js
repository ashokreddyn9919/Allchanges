import { LightningElement,track,api } from 'lwc';

export default class GrandParent extends LightningElement {

    @api selectedValues= 0;
    handleReest(event) {
        this.template.querySelector('form').reset();
        this.selectedValues= 0;
    }
}