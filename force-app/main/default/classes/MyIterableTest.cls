@IsTest
public class MyIterableTest {
    
    @IsTest
    static void testIterableForLoop() {
        // Step 1: Create a list of strings
        List<String> strings = new List<String>{'Hello', 'World'};
        
        // Step 2: Create an instance of MyIterable with the list of strings
        MyIterable myIterableInstance = new MyIterable(strings);
        
        // Step 3: Add a debug statement to verify test execution
        System.debug('Running the for loop...');
        
        // Step 4: Use a for loop to iterate over the MyIterable instance
        for (String str : myIterableInstance) {
            // Step 5: Print each string using System.debug
            System.debug('String: ' + str);
        }
    }
}