import { LightningElement ,api ,track, wire} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CAMPAIGN_OBJECT from '@salesforce/schema/Campaign';
import RECORDTYPEID from '@salesforce/schema/Campaign.RecordTypeId';
const _FIELDS = [RECORDTYPEID];
import { getRecord,getFieldValue } from 'lightning/uiRecordApi';
export default class RecordCreateAccount extends LightningElement {
   @api recordId;
   @track RecordType;
   @api objectApiName;
   @track objectInfo;
   @track error;
   @track record;
 

    @wire(getObjectInfo,  { objectApiName: CAMPAIGN_OBJECT })
    ObjectInfo;

    @wire(getRecord, { recordId: '$recordId', fields: _FIELDS })
    wiredRecord({ data, error }) {
        if (data) {
           this.record = data;
          this.RecordType = this.record.fields.RecordTypeId.value;
           this.error = undefined;
       } else if (error) {
          this.error = error;
           this.record = undefined;
     }
    }
   

   get isrecordTypeNameB() {
        // Returns a map of record type Ids 
        const rtis = this.ObjectInfo.data.recordTypeInfos;
        const rtInfo= Object.keys(rtis).find(rti => rtis[rti].name === 'B');
        
        if(this.RecordType===rtInfo){
            return true;
            console.log('Checking recordtype name----->'+this.RecordType);
            console.log('Checking recordtype name1----->'+this.rtInfo);
        } else{
            return false;
        }  
        
    }
    get isrecordTypeNameA() {
        // Returns a map of record type Ids 
        const rtis = this.ObjectInfo.data.recordTypeInfos;
        //const rtId = getFieldValue(this.wiredRecord.record,  RECORDTYPEID);
        const rtInfo= Object.keys(rtis).find(rti => rtis[rti].name === 'A');
       
        
        if(this.RecordType===rtInfo){
            return true;
            console.log('Checking recordtype name2----->'+this.RecordType);
            console.log('Checking recordtype name3----->'+this.rtInfo);
        } else{
            return false;
        }
    }
    }