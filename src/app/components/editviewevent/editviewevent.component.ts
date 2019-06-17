import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APIConstants } from 'src/app/constants/api-constants';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { SalonSection } from 'src/app/common/salon-section.model';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common/common-service.service';
import { Salon } from 'src/app/common/salon';
import { FilterModel } from 'src/app/constants/api-filter.model';

@Component({
  selector: 'edit-view-event',
  templateUrl: './editviewevent.component.html',
  styleUrls: ['./editviewevent.component.scss']
})
export class EditViewEventComponent implements OnInit {
  public createMessage: string;
  eventId: string ="";
  salon: Salon;
  salonForm: FormGroup;
  sectionForm: FormGroup;
  sectionElements: SalonSection[];
  section: string="";
  status: string = "";
  isAdmin = false;
  countries: Array<any> =  [{value : "1" , label: "Singapore" , selected: false},
                            {value : "2" , label: "Europe", selected: false},
                            {value : "3" , label: "Malaysia", selected: false},
                            {value : "4" , label: "Germany", selected: false}];
  constructor(private http: HttpClient, private formBuilder:FormBuilder, private route: ActivatedRoute, private common: CommonService ) { 
    let that = this;
    this.route.params.subscribe( params => {
      that.eventId = params.id;
    });
  }
  
  ngOnInit() {
    if(this.common.$shared.$user && ( this.common.$shared.$user.$role === "ADMIN" || this.common.$shared.$user.$role === "SUPERADMIN")) {
      this.isAdmin = true;
    }
    const sectionGroup: FormGroup = this.formBuilder.group({
                                                          name: 'COLOR',
                                                          enabled: true,
                                                          price: '',
                                                          discount: ''
                                                        });
    
    this.salonForm = this.formBuilder.group({
      name:["", Validators.required],
      link: ["", Validators.required],
      country: ["", Validators.required],
      patronage: ["", Validators.required],
      transactionId: ["", Validators.required],
      paypalId: ["", Validators.required],
      notes: ["", Validators.required],
      closingDate: ["", Validators.required],
      sections: this.formBuilder.array([sectionGroup]),
      section: ""

    });
    let that = this;
    const filter: FilterModel = new FilterModel();
    if( this.eventId !== "" ) { 
      filter.$where({salonId : this.eventId});
    }
    
    let header = APIConstants.HTTP_HEADERS;
    this.http.get(APIConstants.API_ENDPOINT+`salons`,
                   { "headers":  header ,
                   "params" : { "filter" :  JSON.stringify(filter) }}).subscribe((result: Salon)=>{ 
                      that.salon = result[0];
                      that.salonForm.get("name").setValue(that.salon.name);
                      that.salonForm.get("link").setValue(that.salon.link);
                      that.countries.forEach((countr) => { if( countr.label === that.salon.country ) countr.selected = true; });
                      that.salonForm.get("country").markAsTouched();
                      that.salonForm.get("patronage").setValue(that.salon.patronage);
                      that.salonForm.get("transactionId").setValue(that.salon.transactionId);
                      that.salonForm.get("paypalId").setValue(that.salon.paypalId);
                      that.salonForm.get("notes").setValue(that.salon.notes);
                      that.salonForm.get("closingDate").setValue(that.salon.closingDate);
                      (<any[]>(that.salon["sections"])).forEach( (section) => {
                        const sections = this.salonForm.get("sections") as FormArray;
                        sections.push(this.formBuilder.group(section));
                        
                      })
                      
                   });


  }
  public saveSalon() {
    let salon = Object.assign({}, this.salonForm.value);
    salon.salonId = this.salon.salonId;
    salon.club = this.salon.club;
    delete salon["section"];
    const tempD = salon.closingDate;
    salon.closingDate = tempD+"T23:59:59.000Z";
    this.countries.forEach((countr) => {
      if( salon.country === countr.value) {
        salon.country = countr.label;
      }
    });
    
    let header = APIConstants.HTTP_HEADERS;
        if( this.common.authToken ) {
            header["X-Auth-Token"] = this.common.authToken;
        }
    
    this.http.put(APIConstants.API_ENDPOINT+`salons/${this.salon._id}`,
                                      salon, { "headers":  APIConstants.HTTP_HEADERS  }
                                    ).subscribe((re : any)=>{
                                      if(re && re._id){
                                        this.status = "success";
                                        this.createMessage = " Salon updated successfully";
                                        this.salonForm.reset();
                                      }
                                    },(error) => {
                                      console.log("error");
                                      this.status = "failure";
                                      this.createMessage = "Some problem creating Salon!";
                                    });
    
  } 
  public addSection(){
    const sections = this.salonForm.get("sections") as FormArray;
    const name = this.salonForm.get("section").value;
    sections.push(this.formBuilder.group({name: name,
                                          enabled: true,
                                          price: 0,
                                          discount: 0}));

  }

  get sectionsArray() {
    return <FormArray> this.salonForm.get("sections");
  } 
}
