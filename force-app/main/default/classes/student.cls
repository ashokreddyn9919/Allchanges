Public class student {
String Name;
	Public student(){
		System.debug('Constructor is executed');
	}
	Public student(Integer a){
		System.debug('Integer argument Constructor is executed');
	}
	
	Public student(String str){
		System.debug('String Argument Constructor is executed');
        name = str;
	}
	
	Public void Print(){
		System.debug(Name);
	}
}