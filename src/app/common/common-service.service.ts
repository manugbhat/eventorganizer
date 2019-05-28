import { Injectable } from '@angular/core';
import { CommonData } from './common-data.model';
import { SideNavConstants } from './sidenav.constants';
import { APIConstants } from '../constants/api-constants';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private sharedData: CommonData
  private sideNav: string[] = SideNavConstants.SIDENAV_ELEMENTS;
  public authToken: string = "";

  private subject = new Subject<string>();
  private dataSubject = new Subject<CommonData>();
    setToken(token: string) {
        this.authToken = token;
        this.subject.next(this.authToken);
    }

    getToken(): Observable<string> {
      return this.subject.asObservable();
    }

    getData(): Observable<CommonData> {
      return this.dataSubject.asObservable();
    }

  public get $authToken(): string  {
		return this.authToken;
	}
  
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
    this.dataSubject.next(data);
  }

  
  
}
