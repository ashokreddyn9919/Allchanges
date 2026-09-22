import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WorkspaceAPI extends LightningElement {
    @track showPopup = false;

    simulateCloseTab() {
        this.showPopup = true; // Trigger the popup
    }

    handleCancel() {
        this.showPopup = false; // Dismiss the popup
    }

    handleClose() {
        this.showPopup = false;
        // Call workspaceAPI to close the tab
        const workspaceAPI = this.template.querySelector('lightning:workspaceAPI');
        if (workspaceAPI) {
            workspaceAPI
                .getFocusedTabInfo()
                .then((response) => {
                    workspaceAPI.closeTab({ tabId: response.tabId });
                    this.showToast('Tab Closed', 'The tab has been closed successfully.', 'success');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}