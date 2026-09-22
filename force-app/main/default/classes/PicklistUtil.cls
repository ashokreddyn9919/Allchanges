public class PicklistUtil {
    public static List<String> getValues(Schema.DescribeFieldResult field) {
        List<Schema.PicklistEntry> ple = field.getPicklistValues();
        List<String> values = new List<String>();
        for (Schema.PicklistEntry f : ple) {
            values.add(f.getValue());
        }
        return values;
    }
}