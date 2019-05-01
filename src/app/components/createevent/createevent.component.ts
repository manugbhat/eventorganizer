import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APIConstants } from 'src/app/constants/api-constants';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
      patronage: [""],
      transactionId: "",
      paypalId: "",
      notes: "",
      closingDate: "",
      sections: this.formBuilder.array([sectionGroup]),
      section: ""

    });

  }
  public saveSalon() {
    const salon = Object.assign({}, this.salonForm.value);
    delete salon["section"];
    const tempD = salon.closingDate;
    salon.closingDate = tempD+"T00:00:00Z";
    this.http.post(APIConstants.API_ENDPOINT+"salons",
                                      salon, { "headers":  APIConstants.HTTP_HEADERS  }
                                    ).subscribe((re)=>{
                                      if(re){
                                        this.status = "success";
                                        this.createMessage = " Salon created successfully";
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
