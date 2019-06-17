import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { APIConstants } from 'src/app/constants/api-constants';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { Salon } from 'src/app/common/salon';
import { CommonService } from 'src/app/common/common-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  searchResult: Salon[];
  isAdmin: boolean= false;
  currentSalon: Salon;
  paymentId: string;
  constructor(private router: Router, private http: HttpClient, private formBuilder:FormBuilder, private common: CommonService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      salonName:[""],
      closingDate: [""]
    });
    if(this.common.$shared.$user && ( this.common.$shared.$user.$role === "ADMIN" || this.common.$shared.$user.$role === "SUPERADMIN")) {
      this.isAdmin = true;
    }
    let header = APIConstants.HTTP_HEADERS;
    
      this.searchSalon();
  }

  public createSalon(){
    this.router.navigate(['/salon']);
  }
  public searchSalon(){
    let name: string = this.searchForm.get("salonName").value;
    let closingDate: string;
    if(this.searchForm.get("closingDate").value !== "") {

      closingDate = this.searchForm.get("closingDate").value+"T23:59:59.000Z";
    }
    console.log("clos ", closingDate);
    
    const filter: FilterModel = new FilterModel();
    if( name !== "" ) { 
      filter.$where({name : {regexp: "/"+name+"/"}});
    }
    else if ( closingDate && closingDate !== "" ){
      filter.$where({closingDate : { lte : closingDate }});
    }
    this.load(filter);
    
  }

  public load(filter: FilterModel){
    let header = APIConstants.HTTP_HEADERS;
    if( this.common.authToken ) {
      header["X-Auth-Token"] = this.common.authToken;
    }

    const API : string  = (this.isAdmin) ? "salons" : "user-salons";
    this.http.get(APIConstants.API_ENDPOINT+API, { "headers":  header, 
                      "params" : { "filter" :  JSON.stringify(filter) }
                      }).subscribe((result: Salon[])=>{
                        result.map((salon: Salon) => {
                          salon.closingDate =  (salon.closingDate) ? salon.closingDate.replace(/T.*/gi, function (x) {
                            return "";
                          }): "";
                          if(salon["salonName"]) {
                            salon.name = salon["salonName"];
                          }
                        });
                        this.searchResult = result;
                      });
  }
  public manageEvent(id: string){
    this.router.navigate([`/manageevent/${id}`]);
  }

  public update(salon: Salon, action: string){
    switch(action) {
      case "INTERESTED" : salon["state"] = "INTERESTED";
                          break;
      case "PAID" : salon["state"] = "PAID";
                          break;
      default : break;
    }
    const salonId = salon._id;
    delete salon.closingDate;
    delete salon.name;
    delete salon._id;
    const API : string  = (this.isAdmin) ? "salons/" : "user-salons/";
    let header = APIConstants.HTTP_HEADERS;
    if( this.common.authToken ) {
      header["X-Auth-Token"] = this.common.authToken;
    }
    this.http.patch(APIConstants.API_ENDPOINT+API+salonId , salon, {"headers":  header}).subscribe((result: any) => {
      this.load( new FilterModel());
    });
  }
  public salonDetails(id: string) {
    this.router.navigate([`/editviewevent/${id}`]);
  }

  public setCurrent(cur ) {
    this.currentSalon = cur;
  }
  public updatePayment(){
    this.currentSalon.transactionId = this.paymentId;
    this.update(this.currentSalon, "PAID");

  }
}
