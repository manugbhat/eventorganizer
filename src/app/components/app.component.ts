import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common/common-service.service';
import { CommonData } from '../common/common-data.model';

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

  constructor( private breakpointObserver: BreakpointObserver, private commonService: CommonService) {
    this.fillerNav = this.commonService.$sideNav;
    if ( !this.commonService.$shared ) {
      this.commonService.$shared = new CommonData();
    } 
    this.commonService.getToken().subscribe((token) => {
      if(token !== "") {
        //if(this.commonService.$shared && this.commonService.$shared.$user) {
          this.signedIn = true;
        //}
      }
    });
    
    
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  

}
