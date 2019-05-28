import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/common/common-service.service';
import { APIConstants } from 'src/app/constants/api-constants';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class SignInService extends CommonService {

    constructor(private http: HttpClient, private common: CommonService) {
        super();
    }

    authUser(data): Observable<any> {
        return this.http.post(APIConstants.API_ENDPOINT + 'user/auth', JSON.stringify(data), httpOptions);
    }

    signupUser(data): Observable<any> {
        return this.http.post(APIConstants.API_ENDPOINT + 'user', JSON.stringify(data), httpOptions);
    }
    

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
