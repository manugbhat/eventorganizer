import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APIConstants } from 'src/app/constants/api-constants';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { SalonSection } from 'src/app/common/salon-section.model';

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.scss']
})
export class CreateeventComponent implements OnInit {
  public createMessage: string;
  salonForm: FormGroup;
  sectionForm: FormGroup;
  sectionElements: SalonSection[];
  section: string="";
  status: string = "";
  countries: Array<any> =  [{value : "1" , label: "Singapore"},
                            {value : "2" , label: "Europe"},
                            {value : "3" , label: "Malaysia"},
                            {value : "4" , label: "Germany"}];
  constructor(private http: HttpClient, private formBuilder:FormBuilder ) { 
    
  }
  
  ngOnInit() {

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


  }
  public saveSalon() {
    let salon = Object.assign({}, this.salonForm.value);
    delete salon["section"];
    const tempD = salon.closingDate;
    salon.closingDate = tempD+"T23:59:59.000Z";
    this.countries.forEach((countr) => {
      if( salon.country === countr.value) {
        salon.country = countr.label;
      }
    })
    this.http.post(APIConstants.API_ENDPOINT+"salons",
                                      salon, { "headers":  APIConstants.HTTP_HEADERS  }
                                    ).subscribe((re : any)=>{
                                      if(re && re._id){
                                        this.status = "success";
                                        this.createMessage = " Salon created successfully";
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
}
