

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { APIConstants } from '../constants/api-constants';



@Injectable()
export class NewsletterService {

    constructor(private http: HttpClient) {

    }

    addPushSubscriber(sub:any) {
        return this.http.post('/api/notifications', sub);
    }

    send() {
        return this.http.post('/api/newsletter', {"send" : "msg"});
    }

}


