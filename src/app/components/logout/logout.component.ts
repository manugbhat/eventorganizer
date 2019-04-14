import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common-service.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private commonService: CommonService) { }

  ngOnInit() {
    this.authService.signOut();
    this.commonService.$shared.$user = undefined;
    this.router.navigate(['/']);
  }

}
