// import module elements
import { LightningElement} from 'lwc';
  
// declare class to expose the component
export default class App extends LightningElement {
  ready = false;
    
  // use lifecycle hook
  connectedCallback() {
    setTimeout(() => {
      this.ready = true;
    }, 3000);
  }
}