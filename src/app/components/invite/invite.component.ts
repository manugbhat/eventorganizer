import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { APIConstants } from 'src/app/constants/api-constants';
import { CommonService } from 'src/app/common/common-service.service';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  inviteForm: FormGroup;
  clubId: string;
  status: boolean;
  message: string;
  inviteCode: string = "";
  role: string ="";
  clubs: any[] = [];
  constructor(private http: HttpClient,private formBuilder: FormBuilder, private common: CommonService, private route: ActivatedRoute, private router : Router) {
    this.route.params.subscribe( params => { 
      console.log(params);
      this.inviteCode = params.code ? params.code : "";
    });
  }

  ngOnInit() {
    this.role = this.common.$shared.$user.$role;
    if( this.inviteCode !== "") {
      this.common.$shared.inviteCode = this.inviteCode;
      this.router.navigate([`/signup`]);
    }
    this.inviteForm = this.formBuilder.group({
                                                name: '',
                                                email: ['',[Validators.required, Validators.email]],
                                                club: ['',[Validators.required]],
                                            });
    let header = APIConstants.HTTP_HEADERS;
        if( this.common.authToken ) {
            header["X-Auth-Token"] = this.common.authToken;
        }
    const filter: FilterModel = new FilterModel();
    let that = this;
    if( this.role === "ADMIN" ) {
      this.http.get<any[]>(APIConstants.API_ENDPOINT+"clubs", 
        { "headers":  header, 
          "params" : { "filter" :  JSON.stringify(filter) }
        }
       ).subscribe( (res:any[]) => {
          that.clubs = _.filter(res, (club) => { return club?true: false;});
          console.log(that.clubs);
          // that.clubId = res[0]._id;
       });
    }
    
  }
  invite(){
    let invite = Object.assign({}, this.inviteForm.value);
    //invite.club = this.clubId ? this.clubId : "";
    let that = this;
    this.http.post(APIConstants.API_ENDPOINT+"invites",
                                      invite, { "headers":  APIConstants.HTTP_HEADERS  }
                                    ).subscribe((re : any)=>{ 
                                      if(re) {
                                        that.status = true;
                                        that.message = "Invite sent!";
                                      }
                                    });
  }

}
