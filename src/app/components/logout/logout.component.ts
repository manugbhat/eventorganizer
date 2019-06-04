import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private commonService: CommonService,private cookieService: CookieService) { }

  ngOnInit() {
    this.commonService.$shared = undefined;
    this.commonService.setToken("");
    this.cookieService.deleteAll();
    this.router.navigate(['/']);
  }

}
