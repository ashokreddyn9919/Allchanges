({
    startJobAutoCheck  : function(component, importJobId) {
        const server = component.find('server');
        const checkInterval = window.setInterval(
            $A.getCallback(() => {
                const jobAction = component.get('c.getImportJob');
                server.callServer(jobAction, {jobId: importJobId}, false, (job) => {
                    console.log(JSON.stringify(job));
                    if (job.Status === 'Aborted' || job.Status === 'Completed' || job.Status === 'Failed') {
                        window.clearInterval(checkInterval);
                        component.set('v.status', 'success');
                    }
                });
            }),
            5000
        );
    }
})