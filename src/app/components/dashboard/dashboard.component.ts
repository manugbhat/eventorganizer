import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { APIConstants } from 'src/app/constants/api-constants';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { Salon } from 'src/app/common/salon';
import { CommonService } from 'src/app/common/common-service.service';
import * as _ from 'lodash';
import { NgxSpinnerService } from "ngx-spinner";

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
  resultsToggle: boolean= true;
  commentsToggle: boolean;
  modalTitle: string;
  comment: string;
  salonComments: any[];
  constructor(private router: Router, private http: HttpClient, private formBuilder:FormBuilder, 
    private common: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
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
                          if(salon["prop"] && salon["prop"][0]["status"]) {
                            salon["state"] = salon["prop"][0]["status"];
                          }
                          
                        });
                        this.searchResult = result;
                        this.spinner.hide();
                      });
  }
  public manageEvent(id: string){
    this.router.navigate([`/manageevent/${id}`]);
  }

  public update(salon: Salon, action: string, value? : string){
    this.spinner.show();
    switch(action) {
      case "INTERESTED" : salon["state"] = "INTERESTED";
                          break;
      case "PAID" : salon["state"] = "PAID";
                          break;
      case "RESULT" : salon["result"] = value;
                      break;
      case "COMMENTS" : salon["comments"] = this.comment;
                        break;
      default : break;
    }
    let salonCopy  = _.cloneDeep(salon);
    const salonId = salonCopy._id;
    delete salonCopy.closingDate;
    delete salonCopy.name;
    delete salonCopy._id;
    const API : string  = (this.isAdmin) ? "salons/" : "user-salons/";
    let header = APIConstants.HTTP_HEADERS;
    if( this.common.authToken ) {
      header["X-Auth-Token"] = this.common.authToken;
    }
    this.http.patch(APIConstants.API_ENDPOINT+API+salonId , salonCopy, {"headers":  header}).subscribe((result: any) => {
      this.load( new FilterModel());
    });
  }
  public salonDetails(id: string) {
    this.router.navigate([`/editviewevent/${id}`]);
  }

  public setCurrent(cur ) {
    this.currentSalon = cur;
    this.modalTitle = "Update your result";
  }
  public updatePayment(){
    this.currentSalon.transactionId = this.paymentId;
    this.update(this.currentSalon, "PAID");

  }

  public updateResult(result: string){
    this.commentsToggle = true;
    this.modalTitle = "Give feedback";
    this.update(this.currentSalon,"RESULT", result);
    this.resultsToggle = false;

  }
  loadComments(salon: Salon) {
    this.spinner.show();
    let header = APIConstants.HTTP_HEADERS;
    this.http.get<any[]>(APIConstants.API_ENDPOINT+`salon-comments/${salon.salonId}`,{'headers' : header})
    .subscribe((result: any[])=>{
      this.salonComments = result;
      this.spinner.hide();
    }); 
  }
  postComment(){
    this.update(this.currentSalon,"COMMENTS");
  }
}
