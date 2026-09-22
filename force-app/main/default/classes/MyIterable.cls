public class MyIterable implements Iterable<String> {
    private List<String> strings;
    
    // Constructor that initializes the strings field with the provided list
    public MyIterable(List<String> strings) {
        this.strings = strings;
    }

    // Iterator method that returns an iterator for the strings list
    public Iterator<String> iterator() {
        return strings.iterator();
    }
}