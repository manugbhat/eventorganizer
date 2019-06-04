import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { CommonService } from '../../common/common-service.service';
import { CommonData } from '../../common/common-data.model';
import { SideNavConstants } from '../../common/sidenav.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignInService } from './signin.service';
import { User } from 'src/app/common/user.model';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
 
})
export class SigninComponent implements OnInit {
  loginValidationForm: FormGroup;
  user: SocialUser;
  places;
  errorMessage: string;
  loggedIn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonSharedService: CommonService,
    private signInService: SignInService,
    private cookieService: CookieService) {
    if(this.commonSharedService.authToken === "") {
      this.loginValidationForm = fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required],
      });
      this.loggedIn = false;
    }
    else {
      this.loggedIn = true;
    }
   
  }

  get email() { return this.loginValidationForm.get('email'); }
  get password() { return this.loginValidationForm.get('password'); }

  ngOnInit() {
   
    if(this.signInService.authToken !== "" ){
      this.commonSharedService.setToken("");
      this.loggedIn = false;
    }
  }

  signup() {
    this.router.navigate(['signup']);
  }

  login() {
      this.signInService.authUser(this.loginValidationForm.getRawValue()).subscribe(res => {
        if (res.prop && res.prop.auth === 'Success') {
          
          this.loggedIn = true;
          const user: User = new User();
          user.$name = res.prop.user.fullName;
          user.$age = res.prop.user.age;
          user.$email = res.prop.user.email;
          user.$phone = res.prop.user.phone;
          user.$role = res.prop.user.role;
          user.$_id = res.prop.user._id;
          let common: CommonData = new CommonData();
          common.$user = user;
          this.commonSharedService.$shared = common;
          this.cookieService.set("UserAuthToken", res.prop.token);
          this.cookieService.set("UserName", user.$name);
          this.cookieService.set("UserRole", user.$role);
          this.commonSharedService.setToken(res.prop.token);
          this.router.navigate(['/']);
          //alert(JSON.stringify(res));
        } else {
          this.errorMessage = 'Invalid Username or Password';
        }
      });
  }
  logout() {
    if(this.commonSharedService.authToken !== "") {
      this.commonSharedService.setToken("");
      this.loggedIn = false;
      this.router.navigate(['/']);
    }
  }

  
}
