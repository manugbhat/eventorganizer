import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common/common-service.service';
import { CommonData } from '../common/common-data.model';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../common/user.model';
import { SwPush } from '@angular/service-worker';
import { NewsletterService } from '../services/newsletter.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  readonly VAPID_PUBLIC_KEY="BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg";
  ngAfterViewInit(): void {
    /* this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => { 
      sub["user"] = "";
      this.newsletterService.addPushSubscriber(sub).subscribe();
    } )
    .catch(err => console.error("Could not subscribe to notifications", err));  */
  }

  title = 'Event manager';
  mobileQuery: MediaQueryList;
  fillerNav: string[];
  signedIn: boolean = false;
  role: string = "";
  isAdmin: boolean = false;
  userName: string ="";
  @ViewChild("collapser")
  collapse: ElementRef ;
  @ViewChild("collapsemenu")
  collapseMenu: ElementRef;

  
  constructor( private breakpointObserver: BreakpointObserver, 
    private commonService: CommonService, 
    private cookieService: CookieService,
    private swPush: SwPush,    
    private newsletterService: NewsletterService,
    router: Router) {
    this.fillerNav = this.commonService.$sideNav;
    const userName = this.cookieService.get("UserName");
    this.userName = userName;
    const userRole = this.cookieService.get("UserRole");
    const authToken = this.cookieService.get("UserAuthToken");
    const id = this.cookieService.get("UserId");
    if ( userName && !this.commonService.$shared ) {
      this.commonService.$shared = new CommonData();
      const u: User = new User();
      u.$name = userName;
      u.$role = userRole;
      u.$_id = id;
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
    router.events.forEach((e) =>{
      if(e instanceof NavigationStart){
        (this.collapse.nativeElement.classList as DOMTokenList).add("collapsed");
        (this.collapseMenu.nativeElement.classList as DOMTokenList).remove("show");
      }
    });
  }
  

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  

}
