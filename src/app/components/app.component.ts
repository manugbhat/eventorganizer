import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common/common-service.service';
import { CommonData } from '../common/common-data.model';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../common/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Event manager';
  mobileQuery: MediaQueryList;
  fillerNav: string[];
  signedIn: boolean = false;
  role: string = "";
  isAdmin: boolean = false;
  userName: string ="";
  constructor( private breakpointObserver: BreakpointObserver, private commonService: CommonService, private cookieService: CookieService) {
    this.fillerNav = this.commonService.$sideNav;
    const userName = this.cookieService.get("UserName");
    this.userName = userName;
    const userRole = this.cookieService.get("UserRole");
    const authToken = this.cookieService.get("UserAuthToken");
    if ( userName && !this.commonService.$shared ) {
      this.commonService.$shared = new CommonData();
      const u: User = new User();
      u.$name = userName;
      u.$role = userRole;
      this.commonService.$shared.$user = u;
      this.role = userRole;
      this.signedIn = true;
      if( this.role === "ADMIN" || this.role === "SUPERADMIN" ) {
        this.isAdmin = true;
      }
      this.commonService.authToken = authToken;
    } 
    this.commonService.getToken().subscribe((token) => {
      if(token !== "") {
        //if(this.commonService.$shared && this.commonService.$shared.$user) {
          this.signedIn = true;
          this.role = this.commonService.$shared.$user.$role;
          this.userName = this.commonService.$shared.$user.$name;
          if( this.role === "ADMIN" || this.role === "SUPERADMIN" ) {
            this.isAdmin = true;
          }
        //}
      } else {
          this.signedIn = false;
          this.role = "";
          this.isAdmin = false;
      }
    });
    
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  

}
