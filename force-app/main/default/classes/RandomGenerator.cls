public class RandomGenerator {
    public static Integer getInt(Integer maxValue) {
        return (Math.random() * (maxValue +1)).intValue();
    }

    public static Integer getIntFromRange(Integer minValue, Integer maxValue) {
        return minValue + getInt(maxValue - minValue);
    }

    public static Double getDouble(Double maxValue) {
        return Math.random() * maxValue;
    }

    public static Double getDouble(Decimal maxValue) {
        return Math.random() * maxValue.doubleValue();
    }

    public static Double getDoubleFromRange(Double minValue, Double maxValue) {
        return minValue + getDouble(maxValue - minValue);
    }

    public static Double getDoubleFromRange(Decimal minValue, Decimal maxValue) {
        return minValue + getDouble(maxValue.doubleValue() - minValue.doubleValue());
    }

    public static Boolean getBoolean() {
        return (getInt(1) == 0);
    }
    
    public static String getStringFromList(List<String> values) {
        return values[getInt(values.size() -1)];
    }

    public static String getPhoneNumber() {
        String phone = '';
        for (Integer i=0; i<10; i++) {
            phone += getInt(9);
        }
        return phone;
    }

    public static List<String> shuffleList(List<String> originalList) {
        List<String> remainingList = originalList.clone();
        List<String> shuffledList = new List<String>();
        Integer count = originalList.size();
        for (Integer i=0; i<count; i++) {
            Integer index = getInt(remainingList.size()-1);
            shuffledList.add(remainingList[index]);
            remainingList.remove(index);
        }
        return shuffledList;
    }
}