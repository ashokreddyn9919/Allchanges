@RestResource(urlMapping='/EPHIntegration/*')
global with sharing class EPHXmlService {

    @HttpPost
    global static String processEPHUpdate() {
        RestRequest req = RestContext.request;
        
        // 1. Get the XML body as a string
        String xmlBody = req.requestBody.toString();
        system.debug('xmlBody--->' +xmlBody);
        
        try {
            // 2. Parse the XML
            Dom.Document doc = new Dom.Document();
            doc.load(xmlBody);
            Dom.XmlNode root = doc.getRootElement();
            system.debug('root-->' +root);
            
            // Assuming XML structure: <Update><Id>001...</Id><Status>Active</Status></Update>
            String recordId = root.getChildElement('Id', null).getText();
            String statusValue = root.getChildElement('Rating', null).getText();
            
            // 3. Update Salesforce Record
            // Note: Use the appropriate SObject (e.g., Account, Case, or Custom Object)
            Account acc = new Account(Id = recordId, Rating = statusValue);
            update acc;
            
            return 'Success: Record ' + recordId + ' updated.';
            
        } catch (Exception e) {
            RestContext.response.statusCode = 400;
            return 'Error processing XML: ' + e.getMessage();
        }
    }
}