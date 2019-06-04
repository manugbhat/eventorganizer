import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/common/common-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIConstants } from 'src/app/constants/api-constants';

@Component({
    selector: 'club',
    templateUrl: './club.component.html',
})
export class ClubComponent implements OnInit{
    status: string;
    createMessage: string;
    clubForm: FormGroup;
    constructor(private http: HttpClient, private common: CommonService, private formBuilder:FormBuilder){}
    ngOnInit(){
        this.clubForm = this.formBuilder.group({
            name: ['', Validators.required],
            adminName: this.common.$shared.$user.$name,
            activities: '',
        });

    }

    saveClub(){
        const club = Object.assign({}, this.clubForm.value);
        let header = APIConstants.HTTP_HEADERS;
        if( this.common.authToken ) {
            header["X-Auth-Token"] = this.common.authToken;
        }
        let that = this;
        this.http.post(APIConstants.API_ENDPOINT+"clubs", club, { "headers":  APIConstants.HTTP_HEADERS  })
           .subscribe((res : any)=>{
                if(res) {
                        that.status = "success";
                        that.createMessage = "Club created!";
                       }
                     },(error) => {
                        console.log("error");
                        that.status = "failure";
                        that.createMessage = "Some problem creating Club!";
                      });
    }
}