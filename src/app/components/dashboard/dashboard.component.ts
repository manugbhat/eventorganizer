import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { APIConstants } from 'src/app/constants/api-constants';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { ModalDirective } from 'angular-bootstrap-md';
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
  sectionGroup: FormGroup;
  sectionForm: FormGroup;
  resultForm: FormGroup;
  searchResult: Salon[];
  isAdmin: boolean= false;
  currentSalon: Salon;
  paymentId: string;
  resultsToggle: boolean= true;
  commentsToggle: boolean;
  modalTitle: string;
  comment: string;
  salonComments: any[];
  iSections: {name: string , shortlist: string}[] = [];
  @ViewChild('interestsModal') public interestModal: ModalDirective;
  @ViewChild('paymentModal') public paymentModal: ModalDirective;
  @ViewChild('resultsModal') public resultsModal: ModalDirective;
  @ViewChild('shortlistModal') public shortlistModal: ModalDirective;
  constructor(private router: Router, private http: HttpClient, private formBuilder:FormBuilder, 
    private common: CommonService, private spinner: NgxSpinnerService) { 
      this.sectionForm = this.formBuilder.group({ 
        sections: this.formBuilder.array([])
      });
      this.resultForm = this.formBuilder.group({ 
        sections: this.formBuilder.array([])
      });
    }

  ngOnInit() {
    this.spinner.show();
    this.searchForm = this.formBuilder.group({
      salonName:[""],
      closingDate: [""]
    });
    this.sectionGroup = this.formBuilder.group({
      name: 'COLOR',
      enabled: true,
      price: '',
      discount: ''
    });
    console.log(this.common.$shared);
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
                          if(salon["prop"] && salon["prop"][0]["comments"]) {
                            salon["comments"] = salon["prop"][0]["comments"];
                          }
                          
                        });
                        this.searchResult = result;
                        this.spinner.hide();
                      });
  }
  public manageEvent(id: string){
    this.router.navigate([`/manageevent/${id}`]);
  }

  public update(salon: Salon, action: string, value? : any){
    this.spinner.show();
    switch(action) {
      case "INTERESTED" : salon["state"] = "INTERESTED";
                          salon["interests"] = value;
                          delete salon["shortLists"];
                          delete salon["results"];
                          break;
      case "SHORTLISTED" : if(salon["shortLists"] && salon["shortLists"].length > 0) {

                            salon["state"] = "SHORTLISTED";
                          } else {
                            salon["state"] = "REJECTED";
                          }
                          delete salon["interests"];
                          delete salon["results"];
                          break;
      case "PAID" : salon["state"] = "PAID";
                    delete salon["shortLists"];
                    delete salon["results"];
                    delete salon["interests"]
                          break;
      case "RESULT" : salon["results"] = value;
                      delete salon["shortLists"];
                      delete salon["interests"];
                      break;
      case "COMMENTS" : salon["comments"] = this.comment;
                        delete salon["shortLists"];
                        delete salon["results"];
                        delete salon["interests"];
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
  public openShowInterest(cur) {
    this.setCurrent(cur);
    let salonSections = (this.currentSalon["interests"] as Array<any>);
    const sections = this.sectionForm.get("sections") as FormArray;
    // sections.removeAt(0);
    if(!_.isEmpty(sections.controls)) {
      _.each(salonSections, (value, i) => {
        sections.controls[i].setValue(value)
      });
    } else {
      _.each(salonSections, (value, i) => {
        console.log(value);
        sections.push(new FormControl(true));
      });

    }
    this.interestModal.show();
  }
  public openShortlist(cur) {
    this.setCurrent(cur);
    let salonSections = (this.currentSalon["interests"] as Array<any>);
    // sections.removeAt(0);
    if(!_.isEmpty(this.iSections)) {
      _.each(salonSections, (value, i) => {
        this.iSections[i].name = value;
      });
    } else {
      let k = 0;
      _.each(salonSections, (value, i) => {
        
        if(_.values(value)[0]) {
          console.log("key " ,  _.keys(value)[0]);
          this.iSections[k] = { name: _.keys(value)[0],
                               shortlist:''
                             };
                             k++;
                             console.log("sec ", this.iSections)
        }
        
      });

    }
    this.shortlistModal.show();
  }
  public openPaymentModal(cur) {
    this.setCurrent(cur);
    this.paymentModal.show();
  }
  public openResults(cur) {
    this.setCurrent(cur);
    let salonSections = (this.currentSalon["shortLists"] as Array<any>);
    const sections = this.resultForm.get("sections") as FormArray;
    // sections.removeAt(0);
    if(!_.isEmpty(sections.controls)) {
      _.each(salonSections, (value, i) => {
        sections.controls[i].setValue(value)
      });
    } else {
      _.each(salonSections, (value, i) => {
        console.log(value);
        sections.push(this.formBuilder.group( {
          name: _.keys(value)[0],
          result: ''
        }));
      });

    }
    this.resultsModal.show();
  }
  public setCurrent(cur, type? ) {
    this.currentSalon = cur;
    this.modalTitle = "Update your result";
  }
  public updatePayment(){
    this.currentSalon.transactionId = this.paymentId;
    this.update(this.currentSalon, "PAID");
    this.paymentModal.hide();
  }
  public updateShortlists(){
    const filteredSections = _.filter(this.iSections, (section)=>{
      return section.shortlist == "1";
    });
    this.currentSalon["shortLists"] = _.map(filteredSections, (section) => {
                                            if(section.shortlist == "1") {
                                              return {[section.name] : "SHORTLISTED"};
                                            }
                                          });
    this.update(this.currentSalon, "SHORTLISTED");
    this.shortlistModal.hide();
  }
  public updateResult(){
    this.commentsToggle = true;
    this.modalTitle = "Give feedback";
    this.update(this.currentSalon,"RESULT", this.resultForm.get('sections').value);
    this.resultsToggle = false;
    this.resultsModal.hide();
  }

  public updateInterests() {
    const sections: FormArray = this.sectionForm.get("sections") as FormArray;
    console.log(sections);
    let salonSections = (this.currentSalon["interests"] as Array<any>);
    const interestedSections: any[] = [];
     _.each(salonSections, (salonS, i) => {
        interestedSections.push({ [salonS.name] : sections.controls[i].value});
    });
    console.log("selct ", interestedSections);
    this.update(this.currentSalon, "INTERESTED", interestedSections);
    this.interestModal.hide();
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
  get sections() {
    return <FormArray> this.sectionForm.get("sections");
  } 
  get rSections() {
    return <FormArray> this.resultForm.get("sections");
  }
  getLabel(i) {
    return _.keys(this.currentSalon["shortLists"][i])[0];
  }
}
