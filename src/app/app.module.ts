
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthServiceConfig } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { NgMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { CommonService } from './common/common-service.service';
import { AppComponent } from './components/app.component';
import { ClubComponent } from './components/club/club.component';
import { CreateeventComponent } from './components/createevent/createevent.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditViewEventComponent } from './components/editviewevent/editviewevent.component';
import { EventmgmtComponent } from './components/eventmgmt/eventmgmt.component';
import { HomeComponent } from './components/home/home.component';
import { InviteComponent } from './components/invite/invite.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResultsComponent } from './components/results/results.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { MaterialModule } from './material/material.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { NewsletterService } from './services/newsletter.service';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ClubComponent,
    CreateeventComponent,
    DashboardComponent,
    EditViewEventComponent,
    EventmgmtComponent,
    InviteComponent,
    HomeComponent,
    InviteComponent,
    SigninComponent,
    LogoutComponent,
    ProfileComponent,
    ResultsComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    MDBBootstrapModule.forRoot(),
    NgMaterialModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: AuthServiceConfig,
  },
    HttpClientModule,
    CommonService,
    CookieService,
    NewsletterService ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppModule {

}
