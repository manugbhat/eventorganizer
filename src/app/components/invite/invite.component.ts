import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { APIConstants } from 'src/app/constants/api-constants';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  inviteForm: FormGroup;
  constructor(private http: HttpClient,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inviteForm = this.formBuilder.group({
                              name: '',
                              email: ['',[Validators.required, Validators.email]],
                              club: '',
                          });
  }
  invite(){
    let salon = Object.assign({}, this.inviteForm.value);
    
    this.http.post(APIConstants.API_ENDPOINT+"invites",
                                      salon, { "headers":  APIConstants.HTTP_HEADERS  }
                                    ).subscribe((re : any)=>{ });
  }

}
