import { LightningElement } from 'lwc';
import SL from '@salesforce/resourceUrl/Avyaan1';
import {loadStyle, loadScript} from 'lightning/platformResourceLoader';

export default class SimpleLightBoxExample extends LightningElement {

    renderCallback(){
        Promise.all([
            loadStyle(this, SL),
            loadScript(this, SL+'/')
        ])
    }
}