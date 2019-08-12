import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { CommonService } from 'src/app/common/common-service.service';
import { Salon } from 'src/app/common/salon';
import { User } from 'src/app/common/user.model';
import { APIConstants } from 'src/app/constants/api-constants';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { headersToString } from 'selenium-webdriver/http';
import { NgxSpinnerService } from 'ngx-spinner';

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
  constructor(private http: HttpClient, private route: ActivatedRoute, private common: CommonService, private spinner: NgxSpinnerService) {
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

  public updateShortlist(){
    this.currentMember["shortListed"] = (this.shortlist == "1") ?true: false;
    let header = APIConstants.HTTP_HEADERS;
    let that = this;
    this.currentMember["state"] = this.currentMember["shortListed"] ? "SHORTLISTED": "REJECTED";
    const salonId = this.currentMember["_id"];
    delete this.currentMember["_id"];
    delete this.currentMember["shortListed"];
    delete this.currentMember["showShortlist"];
    delete this.currentMember["checked"];
    /* const filter: FilterModel = new FilterModel();
    filter.$where({userId : this.currentMember["userId"], salonId: this.currentMember["salonId"]}); */
    this.http.patch(APIConstants.API_ENDPOINT+`user-salons/${salonId}`, this.currentMember,
                                                            { "headers":  header, 
                                                              //"params" : { "filter" :  JSON.stringify(filter) }
                                                              }).subscribe((result: any)=>{ console.log(result); });

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
