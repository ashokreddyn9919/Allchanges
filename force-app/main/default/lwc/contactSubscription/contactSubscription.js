import { LightningElement } from 'lwc';
import pubsub from "c/pubsub";

export default class ContactSubscription extends LightningElement {
    message;
    connectedCallback(){
        this.register();
    }
    register(){
        window.console.log("event registered");
        pubsub.register("simplevt", this.handleEvent.bind(this));
    }
    handleEvent(messageFromEvt){
        window.console.log("event handled", messageFromEvt);
        this.message = messageFromEvt
        ? JSON.stringify(messageFromEvt, null, "\t")
        : "No message payload";
    }
}