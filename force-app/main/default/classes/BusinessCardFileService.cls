public with sharing class BusinessCardFileService {

    public static void attachImageToRecord(Id recordId, String base64Data, String contentType) {
        if (recordId == null || String.isBlank(base64Data)) return;

        Blob body;
        try {
            body = EncodingUtil.base64Decode(base64Data);
        } catch (Exception ex) {
            return;
        }

        String ext = 'jpg';
        if (!String.isBlank(contentType) && contentType.toLowerCase().contains('png')) {
            ext = 'png';
        }
        System.debug('ext-->' +ext);

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
        cdl.ShareType = 'V';
        cdl.Visibility = 'AllUsers';
        insert cdl;
    }
}