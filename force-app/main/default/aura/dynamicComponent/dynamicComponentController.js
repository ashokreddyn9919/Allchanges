({
	doInit : function(component, event, helper) {
        
        $A.createComponent(
            "lightning:button",
            {
                "aura:id" : "findableAuraId",
                "label" : "Click Me",
                "onclick" : component.getReference("c.handlerClick")
            },
            function(newButton, status, errorMessage){
                if(status=== "SUCCESS"){
                    var body = component.get("v.body");
                    body.push(newButton);
                    component.set("v.body", body);
                } else if (status === "INCOMPLETE"){
                    console.log("No Response from server or client if offline");
                } else if (status === "Error"){
                    console.log("Error" +errorMessage);
                }
            });
    },
    
    handlerClick : function (component, event, helper){
      component.set("v.message", "Button Clicked");  
    } 
})