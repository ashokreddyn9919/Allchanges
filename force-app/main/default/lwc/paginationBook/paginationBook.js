import { LightningElement, api} from 'lwc';

export default class PaginationBook extends LightningElement {

    currentPage = 1
    totalRecords
    totalpage = 0
    bookSize = 9

    get records(){
        return this.visibleRecords
    }
    @api
    set records(data){
        if(data){
            this.totalRecords=data
            this.totalpage = Math.ceil(data.length/this.bookSize)
            this.updateRecords()
        }
    }
    
    get disablePrevious(){
        return this.currentPage<=1
    }

    get disableNext(){
        return this.currentPage>=this.totalpage
    }

    previouseHandler(){
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1
            this.updateRecords()
        }
    }

    nextHandler(){
        if(this.currentPage < this.totalpage){
            this.currentPage = this.currentPage+1
            this.updateRecords()
        }
    }

    updateRecords(){
        const start = (this.currentPage-1)*this.bookSize
        const end = this.bookSize*this.currentPage
        this.visibleRecords = this.totalRecords.slice(start, end)
        this.dispatchEvent(new CustomEvent('update',{
            detail:{
                records:this.visibleRecords
            }
        }))
    }

}