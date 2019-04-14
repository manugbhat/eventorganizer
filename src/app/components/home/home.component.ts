import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/common/common-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  locations = [
    { city: 'Bengaluru', icon: 'city' },
    { city: 'Mumbai', icon: 'city' },
    { city: 'Kerala', icon: 'city' },
    { city: 'NCR', icon: 'city' },
    { city: 'Hyderabad', icon: 'city' },
    { city: 'Ahmedabad', icon: 'city' },
    { city: 'Pune', icon: 'city' },
    { city: 'Chandigarh', icon: 'city' }
  ];
  currentLocation = 'Starting from?';
  fillerContent = Array.from({ length: 5 }, () =>
    `Voyago is your travel companion.
    As a frequent traveller you get to update your travelling experiences and as well learn the travelling habits of others.
    As a newbie you get to know the travellers and places they have already travelled and a lot of details about their trips
    which you can use to plan your travel. It is as if you are living someone's journey and you know what mistakes you should not repeat :-) !.
    Voyago provides a map based user interface where the points of interest and the other aspects of a trip
    which involves stay, eat, attractions, time spent, weather, ratings and whole lot of other info are presented.
    Voyago is your complete travel manager and assists you in every step of the way right from planning your travel till the last mile.`);
  public promptEvent;
  public addToHome: boolean = false;
  constructor(public common: CommonService, private dialog: MatDialog,) { 
    
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
    
  }
  

}
