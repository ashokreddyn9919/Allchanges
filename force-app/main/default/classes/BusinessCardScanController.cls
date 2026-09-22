public with sharing class BusinessCardScanController {
    public class ScanRequest {
        @AuraEnabled public String fullName;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public String company;
        @AuraEnabled public String locationText;
        @AuraEnabled public String capturedTimeISO;
        @AuraEnabled public Decimal latitude;
        @AuraEnabled public Decimal longitude;
        @AuraEnabled public Id sourceRecordId;
    }

@AuraEnabled
public static Id saveLead(String reqJson) {
    try {
        ScanRequest req = (ScanRequest) JSON.deserialize(reqJson, ScanRequest.class);
        System.debug('REQ => ' + JSON.serialize(req));

        validateReq(req);

        Id existing = findExistingPerson(req.email, req.phone);
        if (existing != null) return existing;

        Lead l = new Lead();
        l.LastName = deriveLastName(req.fullName);
        l.FirstName = deriveFirstName(req.fullName);
        l.Company  = String.isBlank(req.company) ? 'Unknown' : req.company;

        if (!String.isBlank(req.email)) l.Email = req.email;
        if (!String.isBlank(req.phone)) l.Phone = req.phone;

        l.Description = buildDescription(req);
        l.LeadSource = 'Phone Inquiry';

        insert l;
        return l.Id;

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}

@AuraEnabled
public static Id saveContact(String reqJson) {
    try {
        ScanRequest req = (ScanRequest) JSON.deserialize(reqJson, ScanRequest.class);
        System.debug('REQ => ' + JSON.serialize(req));

        validateReq(req);

        Id existing = findExistingPerson(req.email, req.phone);
        if (existing != null) return existing;

        Contact c = new Contact();
        c.LastName = deriveLastName(req.fullName);
        c.FirstName = deriveFirstName(req.fullName);

        if (!String.isBlank(req.email)) c.Email = req.email;
        if (!String.isBlank(req.phone)) c.Phone = req.phone;

        if (!String.isBlank(req.company)) {
            Account a = findOrCreateAccount(req.company);
            c.AccountId = a.Id;
        }

        c.Description = buildDescription(req);

        insert c;
        return c.Id;

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
private static void validateReq(ScanRequest req) {
    if (req == null) {
        throw new AuraHandledException('The request object was null.');
    }
    if (String.isBlank(req.fullName) && String.isBlank(req.email) && 
        String.isBlank(req.phone) && String.isBlank(req.company)) {
        throw new AuraHandledException('No data found. Please ensure the OCR has populated the fields before saving.');
    }
}
    private static String deriveFirstName(String fullName) {
        if (String.isBlank(fullName)) return null;
        List<String> parts = fullName.trim().split('\\s+');
        if (parts.size() <= 1) return null;
        return parts[0];
    }

    private static String deriveLastName(String fullName) {
        if (String.isBlank(fullName)) return 'Unknown';
        List<String> parts = fullName.trim().split('\\s+');
        if (parts.size() == 1) return parts[0];
        return parts[parts.size() - 1];
    }

    private static String buildDescription(ScanRequest req) {
        List<String> lines = new List<String>();
        lines.add('Captured From Business Card Scan');

        if (!String.isBlank(req.locationText)) lines.add('Location: ' + req.locationText);
        if (!String.isBlank(req.capturedTimeISO)) lines.add('Captured Time (ISO): ' + req.capturedTimeISO);

        if (req.latitude != null && req.longitude != null) {
            lines.add('GPS: ' + String.valueOf(req.latitude) + ', ' + String.valueOf(req.longitude));
        }

        if (req.sourceRecordId != null) {
            lines.add('Source Record Id: ' + String.valueOf(req.sourceRecordId));
        }

        return String.join(lines, '\n');
    }

    private static Id findExistingPerson(String email, String phone) {
        if (!String.isBlank(email)) {
            List<Contact> cs = [
                SELECT Id FROM Contact WHERE Email = :email LIMIT 1
            ];
            if (!cs.isEmpty()) return cs[0].Id;

            List<Lead> ls = [
                SELECT Id FROM Lead WHERE Email = :email LIMIT 1
            ];
            if (!ls.isEmpty()) return ls[0].Id;
        }

        String normPhone = normalizePhone(phone);
        if (!String.isBlank(normPhone)) {
            List<Contact> cs2 = [
                SELECT Id, Phone FROM Contact
                WHERE Phone != null
                LIMIT 200
            ];
            for (Contact c : cs2) {
                if (normalizePhone(c.Phone) == normPhone) return c.Id;
            }

            List<Lead> ls2 = [
                SELECT Id, Phone FROM Lead
                WHERE Phone != null
                LIMIT 200
            ];
            for (Lead l : ls2) {
                if (normalizePhone(l.Phone) == normPhone) return l.Id;
            }
        }

        return null;
    }

    private static String normalizePhone(String phone) {
        if (String.isBlank(phone)) return null;
        String digits = phone.replaceAll('[^0-9]', '');
        if (digits.length() < 7) return null;
        if (digits.length() == 11 && digits.startsWith('1')) digits = digits.substring(1);
        return digits;
    }

    private static Account findOrCreateAccount(String company) {
        String name = company.trim();
        List<Account> accs = [
            SELECT Id, Name FROM Account WHERE Name = :name LIMIT 1
        ];
        if (!accs.isEmpty()) return accs[0];

        Account a = new Account(Name = name);
        insert a;
        return a;
    }
}