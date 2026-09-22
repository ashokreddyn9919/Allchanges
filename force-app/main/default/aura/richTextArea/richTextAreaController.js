({
	doInit : function(component, event, helper) {
        
        component.set('v.validate', function(){
            var userInput = component.get('v.value');
            if(userInput){
                return { isValid: true };
            }else if(!userInput && component.get("v.required")){
                return { isValid: false, errorMessage: 'A value is required for this field.' };
            }else{
                return{ isValid: true };
            }
        });
	}
})