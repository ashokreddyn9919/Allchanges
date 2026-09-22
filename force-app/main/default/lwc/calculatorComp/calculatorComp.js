import { LightningElement, track } from 'lwc';

export default class calcDemo extends LightningElement {
    expressionValue;
    resultValue;
    inputRow1 = [ { id: "1"}, { id: "2"}, { id: "3"}, { id: "+"} ];
    inputRow2 = [ { id: "4"}, { id: "5"}, { id: "6"}, { id: "-"} ];
    inputRow3 = [ { id: "7"}, { id: "8"}, { id: "9"}, { id: "*"} ];
    //inputRow4 = [ { id: "CLR"}, { id: "0"}, { id: "="}, { id: "/"} ];
    
    recentOpp;
    lastInput;
    errorMessage='';
    values;

    handleButtonClick(event) {
        event.preventDefault();
        let mathOpps =['+','-','*','/'];
        let labelClicked =  event.target.label;

        if( mathOpps.includes(labelClicked) && mathOpps.includes(this.lastInput)){
                this.errorMessage = 'Invalid Expression';
                this.expressionValue = this.expressionValue+labelClicked;
        } 
        
        if(labelClicked == 'CLR'){
            this.expressionValue = null;
            this.errorMessage = '';
            this.resultValue = null;
        } else{
            
            if(this.errorMessage != 'Invalid Expression'){
                if(this.expressionValue ==undefined){
                    this.expressionValue = labelClicked;
                }else{
                    let oldValue = parseInt(this.expressionValue)
                    this.expressionValue = this.expressionValue+labelClicked;
                    this.values = this.expressionValue.split(/[+*-/=]+/);
                    let lastvalue = this.values[this.values.length-1];
                    if(this.values.length > 1){
                        if(mathOpps.includes(labelClicked) || labelClicked == '='){
                            if(this.values.length == 2 && lastvalue == ""){
                                this.resultValue = parseInt(this.values[0]);
                            }
                            else{
                                console.log('-1 value : ',this.values[this.values.length-2]);
                                if(this.recentOpp == '+'){
                                    this.resultValue = this.resultValue + parseInt(this.values[this.values.length-2]);
                                } else if(this.recentOpp == '-'){
                                    this.resultValue = this.resultValue - parseInt(this.values[this.values.length-2]);
                                } else if(this.recentOpp == '*'){
                                    this.resultValue = this.resultValue * parseInt(this.values[this.values.length-2]);
                                } else if(this.recentOpp == '/'){
                                    this.resultValue = this.resultValue / parseInt(this.values[this.values.length-2]);
                                }
                                
                            }
                            if(labelClicked == '='){
                                this.expressionValue = null;
                            }
                        }
                        
                    }
                    
                }
            }
            
        }
        
        this.lastInput = labelClicked;
        if(mathOpps.includes(labelClicked) ){
            this.recentOpp = labelClicked;
        }
        
    
        
    }
}