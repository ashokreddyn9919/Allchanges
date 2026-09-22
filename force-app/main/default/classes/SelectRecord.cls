public with sharing class SelectRecord {
    public static SObject getRecord(Id recordId, String fieldName) {
        String query = 'SELECT Id, {0} FROM {1} WHERE Id = :recordId';
        return Database.query(String.format(query, new List<String>{ fieldName, recordId.getSobjectType().getDescribe().getName() }));
    }
}