import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { CommonService } from 'src/app/common/common-service.service';
import { Salon } from 'src/app/common/salon';
import { User } from 'src/app/common/user.model';
import { APIConstants } from 'src/app/constants/api-constants';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { headersToString } from 'selenium-webdriver/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-eventmgmt',
  templateUrl: './eventmgmt.component.html',
  styleUrls: ['./eventmgmt.component.scss']
})
export class EventmgmtComponent implements OnInit {
  isAdmin: boolean = false;
  role: string = "";
  eventId: string ="";
  shortlist: string ="";
  members: User[] = [];
  selectedMembers: User[] = [];
  currentMember: User;
  salon: Salon ;
  message: {msg: string, status: string} = { msg : '' , status : ''};
  sectionForm: FormGroup;
  sections: {name: string , shortlist: string}[] = [];
  @ViewChild('shortlistModal') public shortlistModal: ModalDirective;
  constructor(private http: HttpClient, private route: ActivatedRoute, private common: CommonService, private formBuilder:FormBuilder, private spinner: NgxSpinnerService) {
    let that = this;
    this.route.params.subscribe( params => {
      that.eventId = params.id;
    });
    
    
  }

  ngOnInit() {
    this.spinner.show();
    if(this.common.$shared.$user && ( this.common.$shared.$user.$role === "ADMIN" || this.common.$shared.$user.$role === "SUPERADMIN")) {
      this.isAdmin = true;
    }
    let header = APIConstants.HTTP_HEADERS;
    let that = this;
    
    this.http.get(APIConstants.API_ENDPOINT+`salons/${this.eventId}`,
                   { "headers":  header }).subscribe((result: Salon)=>{ 
                      that.salon = result;
                      that.showMembers();
                    });
  }

  public showMembers(): void {
    let header = APIConstants.HTTP_HEADERS;
    let that = this;
    const filter: FilterModel = new FilterModel();
    if( this.salon.club !== "" ) { 
      filter.$where({clubId : this.salon.club, salonId: this.salon.salonId});
    }
    this.http.get(APIConstants.API_ENDPOINT+'salonMembers', 
                    { "headers":  header, 
                    "params" : { "filter" :  JSON.stringify(filter) }
                    }).subscribe((result: any)=>{
                      that.members = result;
                      that.members.forEach((member) => {
                        member["checked"] = true;
                        switch(member["status"]) {
                          case "RECDINV" :  member["status"] = "Invite Sent";
                                            member["checked"] = false;
                                            member["showShortlist"] = false;
                                            break;
                          case "INTERESTED" : member["status"] = "Invite Accepted";
                                              member["showShortlist"] = true;
                                              member["checked"] = false;
                                              break;
                          case "PAID" : member["status"] = "Payment done";
                                        member["showShortlist"] = true;
                                        member["checked"] = false;
                                        break;
                          case "SHORTLISTED" : member["status"] = "Shortlisted";
                                        member["showShortlist"] = false;
                                        member["checked"] = false;
                                        break;
                          default : member["status"] ="";
                                    member["showShortlist"] = false;
                                    break;
  
                        } 
                      });
                      that.selectedMembers = _.filter(that.members, (member) => {
                        return member.checked;
                      })
                      this.spinner.hide();
                    });
  
  }
  
  public openShortlist(cur) {
    this.setCurrent(cur);
    let salonSections = (this.currentMember["interests"] as Array<any>);
    // sections.removeAt(0);
    if(!_.isEmpty(this.sections)) {
      _.each(salonSections, (value, i) => {
        this.sections[i].name = value;
      });
    } else {
      let k = 0;
      _.each(salonSections, (value, i) => {
        
        if(_.values(value)[0]) {
          console.log("key " ,  _.keys(value)[0]);
          this.sections[k] = { name: _.keys(value)[0],
                               shortlist:''
                             };
                             k++;
                             console.log("sec ", this.sections)
        }
        
      });

    }
    
    this.shortlistModal.show();
  }

  public publish(): void {
    this.spinner.show();
    let sMemberUIds: string[] = _.map(this.selectedMembers, (u : User) => {
      return u["userId"];
    });
    let sMemberIds: string[] = _.map(this.selectedMembers, (u: User) => {
      return u["_id"];
    });
    let salonPublish : any = { salonId : this.salon.salonId, members: sMemberUIds, memberIds: sMemberIds, name: this.salon.name};
    let header = APIConstants.HTTP_HEADERS;
    let that = this;
    this.http.post(APIConstants.API_ENDPOINT+"salons/publish",salonPublish, { "headers":  header })
             .subscribe((result: any[])=>{
                            if(result) {
                              that.message.msg = `Published successfully to ${result.length} members`;
                              that.message.status = "SUCCESS";
                            }
                            this.spinner.hide();
                        },
                        (error: any) => {
                              that.message.msg = `Something went wrong`;
                              that.message.status = "ERROR";
                              this.spinner.hide();
                        });
  }

  public selectMember(event , i, member): void {
    if(!member.checked && event.checked){
      this.selectedMembers.push(member);
    } else if( member.checked && !event.checked){
      this.selectedMembers.splice(i,1);
    }
  }

  public setCurrent(m) {
    this.currentMember = m;
  }

  public updateShortlists(){
    
    let header = APIConstants.HTTP_HEADERS;
    let that = this;
    if( this.common.authToken ) {
      header["X-Auth-Token"] = this.common.authToken;
    }
    const filteredSections = _.filter(this.sections, (section)=>{
                                return section.shortlist == "1";
                              });
    this.currentMember["shortLists"] = _.map(filteredSections, (section) => {
                                            if(section.shortlist == "1") {
                                              return {[section.name] : "SHORTLISTED"};
                                            }
                                          });
    
    this.currentMember["state"] = this.currentMember["shortLists"].length > 0 ? "SHORTLISTED": "REJECTED";
    const salonId = this.currentMember["_id"];
    delete this.currentMember["_id"];
    delete this.currentMember["shortListed"];
    delete this.currentMember["showShortlist"];
    delete this.currentMember["checked"];
    
    this.http.patch(APIConstants.API_ENDPOINT+`user-salons/${salonId}`, this.currentMember,
                                                            { "headers":  header, 
                                                              //"params" : { "filter" :  JSON.stringify(filter) }
                                                              }).subscribe((result: any)=>{ this.shortlistModal.hide(); });

  }

  public completeSalon(){
    this.salon.status = "COMPLETED";
    const salonReq: Salon = _.cloneDeep(this.salon);
    delete salonReq["admin"];
    this.http.patch(APIConstants.API_ENDPOINT+`salons/${salonReq._id}`, salonReq, 
                                                          { "headers": APIConstants.HTTP_HEADERS,
                                                        }).subscribe((result: any) => { 
                                                          if(result) {
                                                            this.message.msg = `Salon completed !`;
                                                            this.message.status = "SUCCESS";
                                                          }
                                                        });

  }
  

}
