
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthServiceConfig } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { CommonService } from './common/common-service.service';
import { AppComponent } from './components/app.component';
import { CreateeventComponent } from './components/createevent/createevent.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventmgmtComponent } from './components/eventmgmt/eventmgmt.component';
import { HomeComponent } from './components/home/home.component';
import { InviteComponent } from './components/invite/invite.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResultsComponent } from './components/results/results.component';
import { SigninComponent } from './components/signin/signin.component';
import { MaterialModule } from './material/material.module';
import { NgMaterialModule } from './angular-material.module';
import { SignupComponent } from './components/signup/signup.component';
import { ClubComponent } from './components/club/club.component';

@NgModule({
  declarations: [
    AppComponent,
    ClubComponent,
    CreateeventComponent,
    DashboardComponent,
    EventmgmtComponent,
    InviteComponent,
    HomeComponent,
    InviteComponent,
    SigninComponent,
    LogoutComponent,
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
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: AuthServiceConfig,
  },
    HttpClientModule,
    CommonService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppModule {

}
