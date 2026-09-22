import { LightningElement, track } from 'lwc';

export default class SimpleCalculator extends LightningElement {
    @track currentresults;
    @track showpreviouseResults = false;
    @track previousResults=[];
    firstnumber;
    secondnumber;

    numberchangehandler(event){
        const inputBoxName = event.target.name;
        if(inputBoxName === 'firstnumber'){
            this.firstnumber = event.target.value;
        }else if(inputBoxName === 'secondnumber'){
            this.secondnumber = event.target.value;
        }
    }

    addHandler(){
        //alert('test');
        const firstN = parseInt(this.firstnumber);
        const secondN = parseInt(this.secondnumber);
        // this.currentresults = 'Results of ' +firstN+ '+' +secondN+ 'is' (firstN+secondN);
        this.currentresults = `Results of ${firstN} + ${secondN} is ${firstN+secondN}`;
        this.previousResults.push(this.currentresults);
        //alert('Results:' +this.currentresults);
    }
    subHandler(){
        const firstN = parseInt(this.firstnumber);
        const secondN = parseInt(this.secondnumber);
        // this.currentresults = 'Results of ' +firstN+ '+' +secondN+ 'is' (firstN+secondN);
        this.currentresults = `Results of ${firstN} - ${secondN} is ${firstN-secondN}`;
        this.previousResults.push(this.currentresults);
    }
    multiplyHandler(){
        const firstN = parseInt(this.firstnumber);
        const secondN = parseInt(this.secondnumber);
        // this.currentresults = 'Results of ' +firstN+ '+' +secondN+ 'is' (firstN+secondN);
        this.currentresults = `Results of ${firstN} X ${secondN} is ${firstN*secondN}`;
        this.previousResults.push(this.currentresults);
    }
    diviHandler(){
        const firstN = parseInt(this.firstnumber);
        const secondN = parseInt(this.secondnumber);
        // this.currentresults = 'Results of ' +firstN+ '+' +secondN+ 'is' (firstN+secondN);
        this.currentresults = `Results of ${firstN} / ${secondN} is ${firstN/secondN}`;
        this.previousResults.push(this.currentresults);
    }

    showpreviouseResultsToggle(event){
        this.showpreviouseResults = event.target.checked;
    }

}