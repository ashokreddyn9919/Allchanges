/**
 * LeadPostProcessQueueable
 * - Runs after Lead insert
 * - Updates optional fields from CardScanController.ScanRequest
 * - Attaches image as File
 */
public class LeadPostProcessQueueable implements Queueable {

    private Id leadId;
    private CardScanController.ScanRequest req;

    public LeadPostProcessQueueable(Id leadId, CardScanController.ScanRequest req) {
        this.leadId = leadId;
        this.req = req;
    }

    public void execute(QueueableContext qc) {
        if (leadId == null || req == null) return;

        // Update only when needed to reduce automation load
        Lead upd = new Lead(Id = leadId);
        Boolean doUpdate = false;

        // ✅ MUST use req.<field>
        if (!String.isBlank(req.email)) { upd.Email = req.email; doUpdate = true; }
        if (!String.isBlank(req.phone)) { upd.Phone = req.phone; doUpdate = true; }
        if (!String.isBlank(req.fax))   { upd.Fax   = req.fax;   doUpdate = true; }

        if (!String.isBlank(req.rawText)) {
            upd.Description = req.rawText.length() > 32000 ? req.rawText.substring(0, 32000) : req.rawText;
            doUpdate = true;
        }

        // Social fields (only if fields exist on Lead)
        Map<String, SObjectField> fldMap = Schema.SObjectType.Lead.fields.getMap();

        if (!String.isBlank(req.facebook) && fldMap.containsKey('Facebook__c')) {
            upd.put('Facebook__c', req.facebook);
            doUpdate = true;
        }

        if (!String.isBlank(req.instagram) && fldMap.containsKey('Instagram__c')) {
            upd.put('Instagram__c', req.instagram);
            doUpdate = true;
        }

        // Optional: store location if you have a custom field
        // if (!String.isBlank(req.locationText) && fldMap.containsKey('Location_Text__c')) {
        //     upd.put('Location_Text__c', req.locationText);
        //     doUpdate = true;
        // }

        if (doUpdate) {
            // optional speed knobs on update
            Database.DMLOptions dml = new Database.DMLOptions();
            dml.assignmentRuleHeader.useDefaultRule = false;
            dml.emailHeader.triggerAutoResponseEmail = false;
            dml.emailHeader.triggerUserEmail = false;
            dml.emailHeader.triggerOtherEmail = false;
            upd.setOptions(dml);

            update upd;
        }

        System.debug('Lead updated: ' + leadId);
        System.debug('LeadPostProcessQueueable - attaching image if present' +req.imageBase64);

        // ✅ Attach image (async). MUST use req.imageBase64 / req.imageContentType
        if (!String.isBlank(req.imageBase64)) {
            BusinessCardFileService.attachImageToRecord(
                leadId,
                req.imageBase64,
                req.imageContentType
            );
        }
    }
}