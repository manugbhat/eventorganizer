import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { CommonService } from '../../common/common-service.service';
import { CommonData } from '../../common/common-data.model';
import { SideNavConstants } from '../../common/sidenav.constants';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
 
})
export class SigninComponent implements OnInit {
  user: SocialUser;
  places;
  constructor(
    
    private router: Router,
    private commonSharedService: CommonService,
    ) { }

  ngOnInit() {
    
  }

  signInWithGoogle(): void {
    /* this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
      console.log(data);
    }); */
    this.router.navigate(['/createevent']);
  }

  signInWithFB(): void {
   /*  this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
      this.user = data;
    }); */
    this.router.navigate(['/bonvoyage']);
  }

  
}
