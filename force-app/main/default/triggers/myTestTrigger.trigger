trigger myTestTrigger on Lead (before Update, After Update, before Insert, after Insert) {
    
    switch on trigger.operationType {
        when BEFORE_INSERT, BEFORE_UPDATE {
            system.debug('Lead Trigger invoked before update');
            List<lead> leads = Trigger.new;//list of lead
            Lead leadRecord = leads[0];
            leadRecord.company += ' Inc';
            if(leadRecord.LeadSource == null){
                leadRecord.addError('Lead Source is mandatory!');
            }
        }
        when AFTER_INSERT, AFTER_UPDATE {
            system.debug('Lead Trigger invoked After update');
            List<lead> leads = Trigger.new;//list of lead
            Lead leadRecord = leads[0];
            if(leadRecord.Rating == 'Hot'){
                Task followup = new Task();
                followup.whoId = leadRecord.Id;
                followup.Subject = 'Follow up on a new hot lead';
                followup.Priority = 'High';
                Insert followup;
            }
        }
    }

}