import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../common/common-service.service';
import { CommonData } from '../../common/common-data.model';
import { SideNavConstants } from '../../common/sidenav.constants';
import { SignInService } from '../signin/signin.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [SignInService]
})
export class SignupComponent implements OnInit {
  signupValidationForm: FormGroup;
  places;
  errorMessage: string;
  successMessage: string;
  invite: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonSharedService: CommonService,
    private signInService: SignInService) {
    this.signupValidationForm = fb.group({
      fullName: [null, [Validators.required, Validators.pattern('[a-zA-Z ]+$')]],
      email: [null, [Validators.required, Validators.email]],
      inviteCode: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern('([0-9]{2})?(.*)?([0-9]{10})')]],
      city: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  get email() { return this.signupValidationForm.get('email'); }
  get password() { return this.signupValidationForm.get('password'); }
  get city() { return this.signupValidationForm.get('city'); }
  get name() { return this.signupValidationForm.get('name'); }

  ngOnInit() {
    this.invite = this.commonSharedService.$shared.inviteCode ? this.commonSharedService.$shared.inviteCode: "";
    this.signupValidationForm.get("inviteCode").setValue(this.invite);
  }

  signup() {
    this.signInService.signupUser(this.signupValidationForm.getRawValue()).subscribe(res => {
      if (res.prop && res.prop.created) {
        this.errorMessage = undefined;
        this.successMessage = 'User registered successfully';
        this.commonSharedService.$shared.firstLogin = true;
        this.router.navigate(["/login"]);
      } else {
        this.successMessage = undefined;
        this.errorMessage = res.prop.msg;
      }
    });
  }

  signin() {
    this.router.navigate(['login']);
  }

}
