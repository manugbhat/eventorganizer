

export class Salon {
    public _id: string ="";
    public salonId: number ;
    public name: string = "";
    public link: string = "";
    public club: string = "";
    public country: string = "";
    public patronage: string[] = [""];
    public transactionId: string = "";
    public paypalId: string = "";
    public closingDate: string = "";
    public notes: string[] = [""];
   // public sections: any[] = [{}];
    public section: string = "";

	/* constructor($name:string, $link: string, $country: string, $patronage: string[], $sections: any[], $transactionId?: string, $paypalId?: string, $date? : string) {
        this.name = $name;
        this.link = $link;
        this.sections = $sections ? $sections : [];
        this.country = $country;
        this.patronage = $patronage;
        this.transactionId = $transactionId;
        this.paypalId = $paypalId;
        this.closingDate = $date;
    } */
       
}