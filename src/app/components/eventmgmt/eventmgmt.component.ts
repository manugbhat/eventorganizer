import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eventmgmt',
  templateUrl: './eventmgmt.component.html',
  styleUrls: ['./eventmgmt.component.scss']
})
export class EventmgmtComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( params => console.log(params) );
  }
  ngOnInit() {
  }

}
