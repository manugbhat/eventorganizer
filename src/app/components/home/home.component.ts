import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/common/common-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public promptEvent;
  public addToHome: boolean = false;
  public notSignedIn: boolean = true;
  constructor(public common: CommonService, private dialog: MatDialog, private router : Router) { 
    
  }
  installToHome(): void{
      this.addToHome = false;
      this.promptEvent.prompt();
      this.promptEvent.userChoice
                    .then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                          console.log('User accepted the A2HS prompt');
                        } else {
                          console.log('User dismissed the A2HS prompt');
                        }
                        this.promptEvent = null;
                    });
  }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', event => {
        this.addToHome = true;
        event.preventDefault();
        this.promptEvent = event;
    });
    if( this.common.$shared && this.common.$shared.$user ) {
      this.notSignedIn = false;
    }
    
  }

  login() {
    this.router.navigate(["/signin"]);
  }
  

}
