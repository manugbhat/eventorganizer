import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Event manager';
  mobileQuery: MediaQueryList;
  fillerNav: string[];


  constructor( private breakpointObserver: BreakpointObserver, private commonService: CommonService) {
    this.fillerNav = commonService.$sideNav;
    
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  

}
