public with sharing class CardScanController {

    public class ScanRequest {
        @AuraEnabled public String rawText;
        @AuraEnabled public String fullName;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public String fax;
        @AuraEnabled public String company;
        @AuraEnabled public String locationText;
        @AuraEnabled public String facebook;
        @AuraEnabled public String instagram;
        @AuraEnabled public String imageBase64;
        @AuraEnabled public String imageContentType;
    }

    @AuraEnabled
    public static Id createLeadFromScan(ScanRequest req) {
        if (req == null) {
            throw new AuraHandledException('Request is required.');
        }

        try {
            system.debug('req-->'+req);
            
            Map<String, String> nameParts = splitName(req.fullName);
            Lead l = new Lead();
            l.FirstName = nameParts.get('first');
            l.LastName  = String.isBlank(nameParts.get('last')) ? 'Unknown' : nameParts.get('last');
            l.Company   = String.isBlank(req.company) ? 'Unknown' : req.company;
            l.Status = 'Open - Not Contacted';
            l.LeadSource = 'Business Card Scan';
            Database.DMLOptions dml = new Database.DMLOptions();
            dml.assignmentRuleHeader.useDefaultRule = false;
            dml.emailHeader.triggerAutoResponseEmail = false;
            dml.emailHeader.triggerUserEmail = false;
            dml.emailHeader.triggerOtherEmail = false;
            l.setOptions(dml);
            insert l;

            System.enqueueJob(new LeadPostProcessQueueable(l.Id, req));

            return l.Id;

        } catch (DmlException dmle) {
            throw new AuraHandledException('Lead create failed: ' + dmle.getDmlMessage(0));
        } catch (Exception ex) {
            throw new AuraHandledException('Lead create failed: ' + ex.getMessage());
        }
    }

    private static Map<String, String> splitName(String fullName) {
        Map<String, String> outMap = new Map<String, String>{ 'first' => null, 'last' => null };
        if (String.isBlank(fullName)) return outMap;

        List<String> parts = fullName.trim().split('\\s+');
        if (parts.size() == 1) {
            outMap.put('last', parts[0]);
            return outMap;
        }
        outMap.put('first', parts[0]);
        outMap.put('last', parts[parts.size() - 1]);
        return outMap;
    }
}