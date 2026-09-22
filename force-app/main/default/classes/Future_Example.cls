public class Future_Example {
    @future
    public static void callMe(){
        System.debug('CallMe One');
        System.debug('CallMe Two');
        System.debug('CallMe three');
    }
    @future
    public static void invoke(){
        System.debug('Invoke One');
        callme();
        System.debug('Invoke two');
        System.debug('Invoke three');
    }
    public void show(){
         System.debug('Show One');
         System.debug('Show two');
        	callMe();
         System.debug('Show three');
 		 System.debug('Show four');
        	invoke();
         System.debug('Show five');
         System.debug('Show six');
        
    }
}