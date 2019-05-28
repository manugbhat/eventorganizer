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
    clubForm: FormGroup;
    constructor(private http: HttpClient, private common: CommonService, private formBuilder:FormBuilder){}
    ngOnInit(){
        this.clubForm = this.formBuilder.group({
            name: ['', Validators.required],
            adminName: '',
            activities: '',
        });
    }

    saveClub(){
        const club = Object.assign({}, this.clubForm.value);
        let header = APIConstants.HTTP_HEADERS;
        if( this.common.authToken ) {
            header["X-Auth-Token"] = this.common.authToken;
        }
        this.http.post(APIConstants.API_ENDPOINT+"clubs", club, { "headers":  APIConstants.HTTP_HEADERS  })
           .subscribe((re : any)=>{ });
    }
}