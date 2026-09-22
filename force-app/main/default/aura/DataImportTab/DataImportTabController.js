({
    onInit : function(component, event, helper) {
        const server = component.find('server');
        const jobCheckAction = component.get('c.getRunningImportJobId');
        server.callServer(jobCheckAction, {}, false, (importJobId) => {
            if (importJobId === null) {
                component.set('v.status', 'ready');
            } else {
                component.set('v.status', 'importing');
                helper.startJobAutoCheck(component, importJobId);
            }
        });
    },

    startImport : function(component, event, helper) {
        component.set('v.status', 'importing');
        const server = component.find('server');
        const importAction = component.get('c.importData');
        server.callServer(importAction, {}, false, (importJobId) => {
            console.log('Import job started.');
            helper.startJobAutoCheck(component, importJobId);
        });
    }
})