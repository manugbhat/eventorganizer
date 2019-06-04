import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { APIConstants } from 'src/app/constants/api-constants';
import { FilterModel } from 'src/app/constants/api-filter.model';
import { Salon } from 'src/app/common/salon';
import { CommonService } from 'src/app/common/common-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  searchResult: Salon[];
  isAdmin: boolean= false;
  constructor(private router: Router, private http: HttpClient, private formBuilder:FormBuilder, private common: CommonService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      salonName:[""],
      closingDate: [""]
    });
    if(this.common.$shared.$user && ( this.common.$shared.$user.$role === "ADMIN" || this.common.$shared.$user.$role === "SUPERADMIN")) {
      this.isAdmin = true;
    }
  }

  public createSalon(){
    this.router.navigate(['/salon']);
  }
  public searchSalon(){
    let name: string = this.searchForm.get("salonName").value;
    let closingDate: string = this.searchForm.get("closingDate").value+"T23:59:59.000Z";
    console.log("clos ", closingDate);
    let header = APIConstants.HTTP_HEADERS;
    const filter: FilterModel = new FilterModel();
    if( name !== "" ) { 
      filter.$where({name : {regexp: "/"+name+"/"}});
    }
    else if ( closingDate !== "" ){
      filter.$where({closingDate : { lte : closingDate }});
    }
    
    let that = this;
    this.http.get(APIConstants.API_ENDPOINT+"salons", { "headers":  header, 
                    "params" : { "filter" :  JSON.stringify(filter) }
                    }).subscribe((result: Salon[])=>{
                       result.map((salon: Salon) => {
                        salon.closingDate =  salon.closingDate.replace(/T.*/gi, function (x) {
                          return "";
                        });
                      });
                      that.searchResult = result;
                    });
  }
  public manageEvent(id: string){
    this.router.navigate([`/manageevent/${id}`]);
  }
}
