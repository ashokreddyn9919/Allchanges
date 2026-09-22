import { LightningElement, api, track } from 'lwc';

export default class TabCloseConfirmation extends LightningElement {
    @track showConfirmation = false;
    @api tabId; // Stores the tabId of the tab to be closed

    connectedCallback() {
        // Listen for the tab close event from the workspace API
        const workspaceAPI = this.template.querySelector('lightning:workspaceAPI');
        console.log('workspaceAPI' +workspaceAPI);

        if (workspaceAPI) {
            workspaceAPI.onTabClosed({}).then((event) => {
                this.tabId = event.tabId; // Capture the tabId
                this.showConfirmation = true; // Trigger the confirmation modal
            });
        }
    }

    cancelClose() {
        this.showConfirmation = false; // Dismiss the modal
    }

    confirmClose() {
        this.showConfirmation = false; // Dismiss the modal
        const workspaceAPI = this.template.querySelector('lightning:workspaceAPI');
        if (workspaceAPI) {
            // Close the tab using its tabId
            workspaceAPI.closeTab({ tabId: this.tabId });
        }
    }
}