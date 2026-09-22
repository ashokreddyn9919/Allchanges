import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class DnbAccountCreateWrapper extends LightningElement {
    isDnb = false;
    isEph = false;
    recordTypeName = '';

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference?.state) {
            this.isDnb = currentPageReference.state.c__isDnb === 'true' || currentPageReference.state.c__isDnb === true;
            this.isEph = currentPageReference.state.c__isEph === 'true' || currentPageReference.state.c__isEph === true;
            this.recordTypeName = currentPageReference.state.c__recordTypeName || '';
        }
    }
}