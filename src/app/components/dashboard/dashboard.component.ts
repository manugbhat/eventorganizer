import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  public createSalon(){
    this.router.navigate(['/createevent']);
  }
  public manageEvent(){
    this.router.navigate(['/manageevent']);
  }
}
