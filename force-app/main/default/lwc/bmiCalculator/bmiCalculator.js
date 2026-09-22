import { LightningElement, track } from 'lwc';
import { getBMI } from 'c/bmi';

export default class BmiCalculator extends LightningElement {
cardTitle = 'BMI Calculator:';
bmiData = {
    weight : 0,
    height : 0,
    result : 0
}

@track bmi;

weightchangeHandler(event){
        this.bmiData.weight = parseFloat(event.target.value);
    }
    heightchangeHandler(event){
        this.bmiData.height = parseFloat(event.target.value);
    }
    calculateBMI(){
       this.bmi = getBMI(this.bmiData.weight, this.bmiData.height);
    }
    get bmiValue(){
        if(this.bmi === undefined){
            return " ";
        }
        return `You'r BMI is: ${this.bmi}`;
    }
}