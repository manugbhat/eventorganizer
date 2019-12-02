import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common-service.service';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIConstants } from 'src/app/constants/api-constants';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterModel } from 'src/app/common/filter-model';
import * as _ from "lodash";
@Component(
    {
        selector : 'profile',
        templateUrl : 'profile.component.html'
    }
)
export class ProfileComponent implements OnInit{
    profileForm: FormGroup;
    profile: any;
    status: string = "";
    createMessage:string = "";
    constructor(public common: CommonService, public cookieService: CookieService, private formBuilder:FormBuilder, 
        private http: HttpClient, private spinner: NgxSpinnerService) {
            console.log(this.common.$shared);
	}

    ngOnInit(){
        this.spinner.show();
        const filter: FilterModel = new FilterModel();
        filter.$where({ userId: this.common.$shared.$user.$_id});
        let header = APIConstants.HTTP_HEADERS;
        if( this.common.authToken ) {
            header["X-Auth-Token"] = this.common.authToken;
        }
        this.http.get(APIConstants.API_ENDPOINT+'user-profiles', { 
            "headers": header,
            "params" : { "filter" :  JSON.stringify(filter) }
        }
        ).subscribe( (prof) => {
            this.spinner.hide();
            if(prof) {
                this.profile = prof[0];
                this.profile.age = prof[0]["age"] ? prof[0]["age"] : '0';
                this.profile.city = prof[0]["city"] ? prof[0]["city"] : '';
                this.profile.dob = prof[0]["dob"] ? prof[0]["dob"] : '';
                this.profile.dob = this.profile.dob ? this.profile.dob.replace(/T.*/gi, function (x) {
                                                                                return "";
                                                                            }): "";
                const interests: [] = prof[0]["interests"];
                this.profile.interests = interests ? _.reduce(interests, (a, i) => { return a+","+i } )  : '';
                this.profile.distinctions = prof[0]["distinctions"] ?  _.reduce(prof[0]["distinctions"] , (a, i) => { return a+","+i } ): '';
                this.profileForm.get('age').setValue(this.profile.age);
                this.profileForm.get('city').setValue(this.profile.city);
                this.profileForm.get('dob').setValue(this.profile.dob);
                this.profileForm.get('interests').setValue(this.profile.interests);
                this.profileForm.get('distinctions').setValue(this.profile.distinctions);
            }
        });
        this.profileForm = this.formBuilder.group({
            name: [this.common.$shared.$user.$name],
            age: ['0', Validators.pattern('[0-9][0-9]')],
            city: '',
            dob: [''],
            phone: [this.common.$shared.$user.$phone],
            interests: [''],
            distinctions: [''],
        });

    }

    saveProfile(){
        let profile = Object.assign({}, this.profileForm.value);
        // delete profile["email"];
        delete profile["name"];
        const tempD = profile.dob;
        profile.dob = tempD+"T23:59:59.000Z";
        profile.age = parseInt(profile.age);
         profile.interests = [profile.interests];
        profile.distinctions = [profile.distinctions];
        profile.phone = profile.phone ? profile.phone : '';
        let header = APIConstants.HTTP_HEADERS;
        
        if( this.common.authToken ) {
            header["X-Auth-Token"] = this.common.authToken;
        }
        this.spinner.show();
        this.http.patch(APIConstants.API_ENDPOINT+"user-profiles/"+this.profile._id,
                                      profile, { "headers":  APIConstants.HTTP_HEADERS  }
                                    ).subscribe((re : any)=>{
                                        console.log('UPdated prof');
                                        this.spinner.hide();
                                        this.status = "success";
                                        this.createMessage = "Profile Updated";
                                    },(err) => {
                                        this.spinner.hide();
                                        this.status = "failure";
                                        this.createMessage = "There was a problem";
                                    });
    }
}