Public class Test{
	Public static final Integer Max_Val=10;
	
	Public Test(){
		This(Max_Val);
		System.debug('Default Constructor');
        this.wish();
        this.wish();
        this.wish();
        this.wish();
    }
	Public Test(Integer a){
		System.debug('Integer arg Constructor');
	}
    
    public void wish(){
        System.debug('Welcome to Constructor');
    }
}