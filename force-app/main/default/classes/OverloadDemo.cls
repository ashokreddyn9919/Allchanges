public class OverloadDemo {
    public void walk(){
        System.debug('No Argument Method Executed');
        this.walk(10);
    }
    public void walk(Integer Speed){
        System.debug('Integer Argument Method Executed');
        this.walk('Ashok');
    }
    public void walk(String Name ){
        System.debug('String Argument Method Executed');
        this.walk('Ashok',10);
    }
    public void walk(String Name, Integer speed){
        System.debug('String, Integer Argument Method Executed');
        this.show();
    }
    public void show(){
        System.debug('Welcome to Salesforce');
        this.show('Ashok');
    }
    public void show(String Name){
        System.debug('Welcome to Org');
    }
}