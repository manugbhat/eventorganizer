export class FilterModel {
    where: Where;
    // fields: Fields;
    offset: number = 0;
    limit: number = 10;
    skip: number = 0;
    order: string[] = [""];
    constructor(){
        // this.fields = new Fields();
        this.where = new Where();
    }
    public $where(whereCls: any) {
        this.where = whereCls;
    }
    /* public $fields(field: any) {
        this.fields = field;
    } */
}

class Where {
    placeKey: string
}
class Fields {
    _id: boolean = true;
    name : boolean = true;
    placeKey: boolean =  true;
    description: boolean = true;
    rating: boolean = true;
    creator: boolean = true;
}