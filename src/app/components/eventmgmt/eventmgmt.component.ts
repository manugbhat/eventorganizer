import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { CommonService } from 'src/app/common/common-service.service';
import { Salon } from 'src/app/common/salon';
import { User } from 'src/app/common/user.model';
import { APIConstants } from 'src/app/constants/api-constants';

@Component({
  selector: 'app-eventmgmt',
  templateUrl: './eventmgmt.component.html',
  styleUrls: ['./eventmgmt.component.scss']
})
export class EventmgmtComponent implements OnInit {
  isAdmin: boolean = false;
  role: string = "";
  eventId: string ="";
  members: User[] = [];
  selectedMembers: User[] = [];
  salon: Salon ;
  message: string= "";
  constructor(private http: HttpClient, private route: ActivatedRoute, private common: CommonService) {
    let that = this;
    this.route.params.subscribe( params => {
      that.eventId = params.id;
    });
  }

  ngOnInit() {
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
    this.http.get(APIConstants.API_ENDPOINT+`clubs/${this.salon.club}`, 
                    { "headers":  header }).subscribe((result)=>{ 
                      let members = result["members"];
                      _.forEach(members, (m) => {
                        m["checked"] = true;
                      });
                      that.members = members;
                      that.selectedMembers = members
                    });
  
  }
  
  public publish(): void {
    let sMemberIds: string[] = _.map(this.selectedMembers, (u : User) => {
      return u["_id"];
    });
    let salonPublish : any = { salonId : this.salon._id, members: sMemberIds, name: this.salon.name};
    let header = APIConstants.HTTP_HEADERS;
    let that = this;
    this.http.post(APIConstants.API_ENDPOINT+"salons/publish",salonPublish, { "headers":  header })
             .subscribe((result)=>{
                            if(result) {
                              that.message = "Published successfully";
                            }
                        });
  }

  public selectMember(event , i, member): void {
    if(member.checked){
      this.selectedMembers.splice(i,1);
      console.log(this.selectedMembers);
    }
  }

}
