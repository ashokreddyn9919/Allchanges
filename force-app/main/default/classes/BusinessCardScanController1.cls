public with sharing class BusinessCardScanController1 {

    public class ScanRequest {
        @AuraEnabled public String rawText;
        @AuraEnabled public String fullName;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public String company;
        @AuraEnabled public String locationText;

        // Image from mobile
        @AuraEnabled public String imageBase64;       // base64 only (no "data:image/..;base64,")
        @AuraEnabled public String imageContentType;  // image/jpeg, image/png
    }

    @AuraEnabled
    public static Id createLeadFromScan(ScanRequest req) {
        if (req == null) throw new AuraHandledException('Request is required.');

        Map<String, String> nameParts = splitName(req.fullName);

        Lead l = new Lead();
        l.FirstName = nameParts.get('first');
        l.LastName  = String.isBlank(nameParts.get('last')) ? 'Unknown' : nameParts.get('last');
        l.Company   = String.isBlank(req.company) ? 'Unknown' : req.company;
        l.Email     = req.email;
        l.Phone     = req.phone;

        // OPTIONAL: store raw text in Description (no custom field needed)
        if (!String.isBlank(req.rawText)) {
            l.Description = req.rawText.length() > 32000 ? req.rawText.substring(0, 32000) : req.rawText;
        }

        insert l;

        // Attach image as File (optional but recommended)
        if (!String.isBlank(req.imageBase64)) {
            attachImageToRecord(l.Id, req.imageBase64, req.imageContentType);
        }

        return l.Id;
    }

    private static void attachImageToRecord(Id recordId, String base64Data, String contentType) {
        Blob body;
        try {
            body = EncodingUtil.base64Decode(base64Data);
        } catch (Exception ex) {
            // If decode fails, skip attaching but still keep Lead created
            return;
        }

        String ext = 'jpg';
        if (contentType != null && contentType.toLowerCase().contains('png')) ext = 'png';

        ContentVersion cv = new ContentVersion();
        cv.Title = 'Business Card Scan ' + Datetime.now().format('yyyy-MM-dd HH:mm');
        cv.PathOnClient = 'business-card.' + ext;
        cv.VersionData = body;
        insert cv;

        ContentVersion insertedCv = [
            SELECT ContentDocumentId
            FROM ContentVersion
            WHERE Id = :cv.Id
            LIMIT 1
        ];

        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = insertedCv.ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        cdl.ShareType = 'V'; // Viewer
        cdl.Visibility = 'AllUsers';
        insert cdl;
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