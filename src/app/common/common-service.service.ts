import { Injectable } from '@angular/core';
import { CommonData } from './common-data.model';
import { SideNavConstants } from './sidenav.constants';
import { APIConstants } from '../constants/api-constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private sharedData: CommonData
  private sideNav: string[] = SideNavConstants.SIDENAV_ELEMENTS;
  public apiEndpoint: string = APIConstants.IVV_API_ENDPOINT;
  
    /**
     * Getter $sideNav
     * @return {string[] }
     */
	public get $sideNav(): string[]  {
		return this.sideNav;
	}

    /**
     * Setter $sideNav
     * @param {string[] } value
     */
	public set $sideNav(value: string[] ) {
		this.sideNav = value;
	}
  
  constructor() { 
      
  }
  public get $shared(): CommonData { 
    return this.sharedData;
  }
  public set $shared(data: CommonData) {
    this.sharedData = data;
  }

  
  
}
